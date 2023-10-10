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

  has_many :node_complaint_categories, foreign_key: 'node_id', dependent: :destroy # Complaint category linked to the variable
  has_many :complaint_categories, through: :node_complaint_categories

  before_create :associate_step
  before_validation :validate_ranges, if: Proc.new { answer_type.present? && %w[Integer Float].include?(answer_type.value) }
  before_validation :validate_formula, if: Proc.new { answer_type.display == 'Formula' }
  after_create :create_boolean, if: Proc.new { answer_type.value == 'Boolean' }
  after_create :create_positive, if: Proc.new { answer_type.value == 'Positive' }
  after_create :create_present, if: Proc.new { answer_type.value == 'Present' }
  after_create :create_unavailable_answer, if: Proc.new { is_unavailable } # Ensure unavailable is checked
  after_create :add_to_consultation_orders
  before_update :set_parent_consultation_order
  after_destroy :remove_from_consultation_orders

  scope :formula, -> { where(answer_type_id: [3,4,6]) } # Return variables usable in formula (numeric or date)

  validates_with VariableValidator

  accepts_nested_attributes_for :answers, :node_complaint_categories, allow_destroy: true

  attr_readonly :answer_type_id, :type, :stage, :step, :is_unavailable

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

  # Duplicate a variable with its answers and media files
  def duplicate
    dup_variable = project.variables.create!(self.attributes.except('id', 'reference', 'created_at', 'updated_at'))
    project_language = project.language.code
    label = self.send("label_#{project_language}")
    dup_variable.label_translations[project_language] = "#{I18n.t('copy_of')}#{label}"
    dup_variable.save

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

  # Get the reference prefix according to the type
  def reference_prefix
    return '' if type.blank?
    I18n.t("variables.categories.#{variable_type}.reference_prefix")
  end

  def variable_type
    type.underscore.split("/").last
  end

  private

  # Add variable hash to every algorithms of the project
  def add_to_consultation_orders
    Algorithm.skip_callback(:update, :before, :format_consultation_order, raise: false) # Avoid going through order reformat

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
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.positive', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.negative', locale: k)] } ])
    self.save
  end

  # Automatically create the answers, since they can't be changed
  # Create 2 automatic answers (present & absent) for present questions
  def create_present
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.present', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.absent', locale: k)] } ])
    self.save
  end

  # Automatically create unavailable answer
  # Depends on Variable type
  def create_unavailable_answer;end

  # Remove variable hash to every algorithms of the project
  def remove_from_consultation_orders
    Algorithm.skip_callback(:update, :before, :format_consultation_order, raise: false) # Avoid going through order reformat

    project.algorithms.each do |algorithm|
      order = JSON.parse(algorithm.full_order_json)
      order.delete_if{|hash| hash['id'] == id}
      algorithm.update!(full_order_json: order.to_json)
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

  # Ensure that the formula is in a correct format
  def validate_formula
    # Check if formula is present?
    if formula.nil?
      errors.add(:formula, I18n.t('activerecord.errors.variables.formula.using_function', formula: formula)) unless is_default
      return true
    end

    # Check if the functions ToDay or ToMonth are being used. If so, formula is correct.
    if %w(ToDay() ToMonth()).include?(formula)
      errors.add(:formula, I18n.t('activerecord.errors.variables.formula.using_function', formula: formula)) unless is_default
      return true
    end

    errors.add(:formula, I18n.t('activerecord.errors.variables.formula.wrong_characters')) if formula.match(/^(\{(.*?)\}|[ \(\)\*\/\+\-\.|0-9])*$/).nil?

    # Extract node_references and functions from the formula
    formula.scan(/\{.*?\}/).each do |node_reference|
      # Check for date functions ToDay() or ToMonth() and remove element if it's correct
      is_date = false
      if node_reference.include?('ToDay')
        is_date = true
        node_reference = node_reference.sub!('ToDay', '').tr('()', '')
      elsif node_reference.include?('ToMonth')
        is_date = true
        node_reference = node_reference.sub!('ToMonth', '').tr('()', '')
      end

      # Extract type and node_reference from full node_reference
      node_id = node_reference.gsub(/[\{\}]/, '')
      variable = Node.find_by(id: node_id)

      if variable.present?
        if is_date
          errors.add(:formula, I18n.t('activerecord.errors.variables.node_reference_not_date', node_id: node_id)) unless variable.answer_type.value == 'Date'
        else
          errors.add(:formula, I18n.t('activerecord.errors.variables.formula.node_reference_not_numeric', node_id: node_id)) unless %w(Integer Float).include?(variable.answer_type.value)
        end
      else
        errors.add(:formula, I18n.t('activerecord.errors.variables.formula.wrong_node', node_id: node_id))
      end
    end
  end

  # Validate correct order of validation ranges
  def validate_ranges
    values = []
    # Create array adding every value in the order it should be
    values.push(min_value_error) if min_value_error.present?
    values.push(min_value_warning) if min_value_warning.present?
    values.push(max_value_warning) if max_value_warning.present?
    values.push(max_value_error) if max_value_error.present?

    errors.add(:min_value_error, I18n.t('activerecord.errors.variables.validation_range_incorrect')) if values != values.sort
  end
end
