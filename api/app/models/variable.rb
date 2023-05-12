# Child of Node / Variables asked to the patient
class Variable < Node
  include ActiveModel::Validations

  enum emergency_status: %i[standard referral emergency emergency_if_no]
  enum round: %i[tenth half unit]
  enum stage: %i[registration triage test consultation diagnosis_management]
  enum step: %i[registration_step first_look_assessment_step complaint_categories_step basic_measurements_step
                medical_history_step physical_exam_step test_step health_care_questions_step referral_step]
  enum system: %i[
    general
    respiratory_circulation
    ear_nose_mouth_throat
    visual
    integumentary
    digestive
    urinary_reproductive
    nervous
    muscular_skeletal
    exposures
    chronic_conditions
    comorbidities
    prevention
    follow_up_questions
    complementary_medical_history
    vital_sign
    priority_sign
    feeding
    fever
    dehydration
    malnutrition_anemia
  ]

  belongs_to :answer_type
  belongs_to :reference_table_x, class_name: 'Variable', optional: true
  belongs_to :reference_table_y, class_name: 'Variable', optional: true
  belongs_to :reference_table_z, class_name: 'Variable', optional: true

  has_many :answers, foreign_key: 'node_id', dependent: :destroy
  has_many :node_complaint_categories, foreign_key: 'node_id', dependent: :destroy # Complaint category linked to the variable
  has_many :complaint_categories, through: :node_complaint_categories

  scope :no_treatment_condition, -> { where.not(type: 'Variables::TreatmentQuestion') }
  scope :diagrams_included, lambda {
                              where.not(type: %w[Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::Referral])
                            }

  before_create :associate_step
  after_create :create_boolean, if: Proc.new { answer_type.value == 'Boolean' }
  after_create :create_positive, if: Proc.new { answer_type.value == 'Positive' }
  after_create :create_present, if: Proc.new { answer_type.value == 'Present' }
  after_create :add_to_consultation_orders
  before_update :set_parent_consultation_order
  after_destroy :remove_from_consultation_orders

  before_validation :validate_overlap, if: Proc.new { answers.any? }

  validates_with VariableValidator

  accepts_nested_attributes_for :answers, allow_destroy: true

  # Preload the children of class Variable
  def self.descendants
    [
      Variables::AnswerableBasicMeasurement,
      Variables::AssessmentTest,
      Variables::BackgroundCalculation,
      Variables::BasicDemographic,
      Variables::BasicMeasurement,
      Variables::ChronicCondition,
      Variables::ComplaintCategory,
      Variables::Demographic,
      Variables::Exposure,
      Variables::ObservedPhysicalSign,
      Variables::PhysicalExam,
      Variables::Referral,
      Variables::Symptom,
      Variables::TreatmentQuestion,
      Variables::UniqueTriageQuestion,
      Variables::Vaccine,
      Variables::VitalSignAnthropometric
    ]
  end

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where(
      'nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%"
    ).distinct
  end

  # Duplicate a variable with its answers and media files
  def duplicate
    dup_variable = project.variables.create!(self.attributes.except('id', 'reference', 'created_at', 'updated_at'))

    answers.each do |answer|
      dup_variable.answers.create!(answer.attributes.except('id', 'created_at', 'updated_at'))
    end unless %w[Boolean Positive Present].include?(answer_type.value)

    files.each do |file|
      dup_variable.files.create!(file.attributes.except('id', 'created_at', 'updated_at'))
    end

    node_complaint_categories.each do |node_complaint_category|
      dup_variable.node_complaint_categories.create!(node_complaint_category.attributes.except('id', 'node_id', 'created_at', 'updated_at'))
    end
  end

  private

  # Add variable hash to every algorithms of the project
  def add_to_consultation_orders
    Algorithm.skip_callback(:update, :before, :format_consultation_order) # Avoid going through order reformat

    variable_hash = { id: id, parent_id: consultation_order_parent }
    project.algorithms.each do |algorithm|
      order = JSON.parse(algorithm.full_order_json)
      order.push(variable_hash)
      algorithm.update!(full_order_json: order.to_json)
    end

    Algorithm.set_callback(:update, :before, :format_consultation_order) # Reset callback
  end

  # Associate proper step depending on category ; empty for parent
  def associate_step

  end

  # Get the id of the variable parent (step, system or neonat/olrder children)
  def consultation_order_parent
    if self.is_a?(Variables::ComplaintCategory)
      is_neonat ? 'neonat_children' : 'older_children'
    elsif self.system.present?
      "#{step}_#{system}"
    else
      step
    end
  end

  # Automatically create the answers, since they can't be changed
  # Create 2 automatic answers (positive & negative) for positive questions
  def create_positive
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.positive', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.negative', locale: k)] } ])
    self.save
  end

  # Automatically create the answers, since they can't be changed
  # Create 2 automatic answers (present & absent) for present questions
  def create_present
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.present', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.absent', locale: k)] } ])
    self.save
  end

  # Ensure that the answers are coherent with each other, that every value the mobile user may enter match one and only one answers entered by the medAL-creator user
  def validate_overlap
    return true if !(%w(Float Integer).include?(answer_type.value)) || %w(Variables::BasicMeasurement Variables::BasicDemographic Variables::VitalSignAnthropometric).include?(type)

    self.errors.add(:answers, I18n.t('answers.validation.overlap.one_more_or_equal')) if answers.filter(&:more_or_equal?).count != 1
    self.errors.add(:answers, I18n.t('answers.validation.overlap.one_less')) if answers.filter(&:less?).count != 1

    if answers.filter(&:less?).any? && answers.filter(&:more_or_equal?).any?

      betweens = []
      answers.filter(&:between?).each do |answer|
        betweens.push(answer.value.split(',').map(&:to_f))
      end

      if betweens.any?
        self.errors.add(:answers, I18n.t('answers.validation.overlap.less_greater_than_more_or_equal')) if answers.filter(&:less?).first.value.to_f > answers.filter(&:more_or_equal?).first.value.to_f

        betweens = betweens.sort_by { |a| a[0] }
        self.errors.add(:answers, I18n.t('answers.validation.overlap.first_between_different_from_less')) if answers.filter(&:less?).first.value.to_f != betweens[0][0]
        self.errors.add(:answers, I18n.t('answers.validation.overlap.last_between_different_from_more_or_equal')) if answers.filter(&:more_or_equal?).first.value.to_f != betweens.last[1]

        betweens.each_with_index do |between, i|
          unless i == 0
            self.errors.add(:answers, I18n.t('answers.validation.overlap.between_not_following')) if between[0] != betweens[i - 1][1]
          end
        end
      else
        self.errors.add(:answers, I18n.t('answers.validation.overlap.less_equal_more_or_equal')) if answers.filter(&:less?).first.value.to_f != answers.filter(&:more_or_equal?).first.value.to_f
      end
    end
  end

  # Remove variable hash to every algorithms of the project
  def remove_from_consultation_orders
    Algorithm.skip_callback(:update, :before, :format_consultation_order) # Avoid going through order reformat

    project.algorithms.each do |algorithm|
      order = JSON.parse(algorithm.full_order_json)
      order.delete_if{|hash| hash[:id] = id}
      algorithm.update(full_order_json: order.to_json)
    end

    Algorithm.set_callback(:update, :before, :format_consultation_order) # Reset callback
  end

  # Update json order if the system is changed
  def set_parent_consultation_order
    system_change = changes['system']

    if system_change.present?
      project.algorithms.map do |algorithm|
        order = JSON.parse(algorithm.full_order_json)
        order.each do |hash|
          if hash[:id] == id
            hash[:parent_id] = "#{step}_#{system_change[1]}"
            break # Avoid going through elements after the one we were looking for
          end
        end
        algorithm.update(full_order_json: order.to_json)
      end
    end
  end
end
