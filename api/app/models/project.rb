# Container of many versions of algorithms
class Project < ApplicationRecord
  belongs_to :language

  has_many :user_projects
  has_many :users, through: :user_projects
  has_many :algorithms, dependent: :destroy
  has_many :nodes, dependent: :destroy
  has_many :drugs, -> { where type: 'HealthCares::Drug' }, class_name: 'Node'
  has_many :managements, -> { where type: 'HealthCares::Management' }, class_name: 'Node'
  has_many :diagnoses, -> { where(type: 'Diagnosis') }, class_name: 'Node'
  has_many :variables, -> { where(type: Variable.descendants.map(&:name)) }, class_name: 'Variable'
  has_many :questions_sequences, -> { where(type: QuestionsSequence.descendants.map(&:name)) }, class_name: 'Node'

  validates_presence_of :name
  validates_uniqueness_of :name
  
  after_create :create_default_variables

  accepts_nested_attributes_for :user_projects, reject_if: :all_blank, allow_destroy: true

  translates :emergency_content, :study_description

  def self.ransackable_attributes(auth_object = nil)
    ["name"]
  end
  
  private
  
  def create_default_variables
    age_in_days = variables.create!(label_en: 'Age in days', type: 'Variables::BasicDemographic', stage: Variable.stages[:registration], is_mandatory: true, answer_type_id: 5, formula: 'ToDay', is_default: true)
    weight = variables.create!(label_en: 'Current Weight (kg)', type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 4, is_estimable: true, is_default: true)
    rr = variables.create!(label_en: 'Respiratory rate', type: 'Variables::VitalSignAnthropometric', stage: Variable.stages[:consultation], answer_type_id: 4, system: Variable.systems[:vital_sign], is_default: true)
    muac = variables.create!(label_en: 'MUAC in cm (only if age >6 months)', type: 'Variables::BasicMeasurement', description_en: 'Mid Upper Arm Circumference', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    gender = variables.create!(label_en: 'Gender', type: 'Variables::Demographic', stage: Variable.stages[:registration], answer_type_id: 2, is_mandatory: true, is_default: true)
    height = variables.create!(label_en: 'Height (cm) - if length is measured subtract 0.7cm', type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    length = variables.create!(label_en: 'Length (cm)', type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    bmi = variables.create!(label_en: 'BMI', type: 'Variables::BasicMeasurement', stage: Variable.stages[:registration], answer_type_id: 5, formula: '[BM1] / (([BM3] / 100) * ([BM3] / 100))', is_default: true)
    temperature = variables.create!(label_en: 'Axillary temperature', type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    cc_general = variables.create!(label_en: 'General', type: 'Variables::ComplaintCategory', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 1, is_default: true)
    yi_cc_general = variables.create!(label_en: 'General / Universal Assessment', type: 'Variables::ComplaintCategory', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 1, is_default: true, is_neonat: true)
    village = variables.create!(label_en: 'Village', type: 'Variables::BasicDemographic', stage: Variable.stages[:registration], answer_type_id: 9, is_mandatory: true, is_identifiable: true, is_default: true)
    kind_of_consultation = variables.create!(label_en: 'What kind of consultation is this?', type: 'Variables::Demographic', stage: Variable.stages[:registration], answer_type_id: 2, is_mandatory: true, is_default: true)

    wh = variables.new(label_en: 'How did you measure the child height ?', type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 2, is_default: true)
    wh.save(validate: false)

    # Configure basic questions into the algorithm to be used in json generation
    self.update(medal_r_config: {
      basic_questions: {
        gender_question_id: gender.id,
        weight_question_id: weight.id,
        general_cc_id: cc_general.id,
        yi_general_cc_id: yi_cc_general.id,
      },
      optional_basic_questions: {
        village_question_id: village.id,
        kind_of_consultation_id: kind_of_consultation.id,
      }
    })

    gender.answers.create([
                            {label_en: 'Male', value: 'male'},
                            {label_en: 'Female', value: 'female'}
                          ])

    kind_of_consultation.answers.create([
                                          {label_en: 'New (self-referral)'},
                                          {label_en: 'New (referral from another facility)'},
                                          {label_en: 'Scheduled follow-up'},
                                          {label_en: 'Unscheduled follow-up'}
                                        ])

    age = variables.create!(label_en: 'Age in months', type: 'Variables::BackgroundCalculation', is_mandatory: true, answer_type_id: 5, formula: 'ToMonth', is_default: true)
    age.answers.create([
                         {label_en: 'less than 2 months', value: '2', operator: Answer.operators[:less]},
                         {label_en: 'between 2 and 6 months', value: '2, 6', operator: Answer.operators[:between]},
                         {label_en: 'between 6 and 12 months', value: '6, 12', operator: Answer.operators[:between]},
                         {label_en: 'between 12 and 24 months', value: '12, 24', operator: Answer.operators[:between]},
                         {label_en: 'between 24 and 36 months', value: '24, 36', operator: Answer.operators[:between]},
                         {label_en: 'between 36 and 60 months', value: '36, 60', operator: Answer.operators[:between]},
                         {label_en: 'more than 60 months', value: '60', operator: Answer.operators[:more_or_equal]},
                       ])

    z_score = variables.create!(label_en: 'Weight for age (z-score)', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: weight.id, reference_table_male_name: "z_score_male_table", reference_table_female_name: "z_score_female_table", is_default: true)
    z_score.answers.create([
                             {label_en: 'less than -2 z-score', value: '-2', operator: Answer.operators[:less]},
                             {label_en: '-2 z-score', value: '-2, -1', operator: Answer.operators[:between]},
                             {label_en: 'more than -2 z-score', value: '-1', operator: Answer.operators[:more_or_equal]},
                           ])

    bmi_z_score = variables.create!(label_en: 'BMI (z-score)', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: bmi.id, reference_table_male_name: "bmi_for_age_male_table", reference_table_female_name: "bmi_for_age_female_table", is_default: true)
    bmi_z_score.answers.create([
                                 {label_en: 'less than -2 z-score', value: '-2', operator: Answer.operators[:less]},
                                 {label_en: '-2 z-score', value: '-2, -1', operator: Answer.operators[:between]},
                                 {label_en: 'more than -2 z-score', value: '-1', operator: Answer.operators[:more_or_equal]},
                               ])

    weight_for_height = variables.create!(label_en: 'Weight for height', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: height.id, reference_table_y_id: weight.id, reference_table_male_name: "weight_for_height_male_table", reference_table_female_name: "weight_for_height_female_table", is_default: true)
    weight_for_height.answers.create([
                                       {label_en: 'less than -2 z-score', value: '-2', operator: Answer.operators[:less]},
                                       {label_en: '-2 z-score', value: '-2, -1', operator: Answer.operators[:between]},
                                       {label_en: 'more than -2 z-score', value: '-1', operator: Answer.operators[:more_or_equal]},
                                     ])

    weight_for_length = variables.create!(label_en: 'Weight for length', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: length.id, reference_table_y_id: weight.id, reference_table_male_name: "weight_for_length_male_table", reference_table_female_name: "weight_for_length_female_table", is_default: true)
    weight_for_length.answers.create([
                                       {label_en: 'less than -2 z-score', value: '-2', operator: Answer.operators[:less]},
                                       {label_en: '-2 z-score', value: '-2, -1', operator: Answer.operators[:between]},
                                       {label_en: 'more than -2 z-score', value: '-1', operator: Answer.operators[:more_or_equal]},
                                     ])

    rr_th = variables.create!(label_en: 'Respiratory rate in percentile', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age.id, reference_table_y_id: temperature.id, reference_table_z_id: rr.id, reference_table_male_name: "respiratory_rate_table", reference_table_female_name: "respiratory_rate_table", is_default: true)
    rr_th.answers.create([
                           {label_en: 'less than 75th', value: '75', operator: Answer.operators[:less]},
                           {label_en: 'between 75th and 97th', value: '75, 97', operator: Answer.operators[:between]},
                           {label_en: 'more than 97th', value: '97', operator: Answer.operators[:more_or_equal]},
                         ])

    muac_z_score = variables.create!(label_en: 'MUAC for age z-score', type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: muac.id, reference_table_male_name: "muac_z_score_male_table", reference_table_female_name: "muac_z_score_female_table", is_default: true)
    muac_z_score.answers.create([
                                  {label_en: 'less than -2 z-score', value: '-2', operator: Answer.operators[:less]},
                                  {label_en: '-2 z-score', value: '-2, -1', operator: Answer.operators[:between]},
                                  {label_en: 'more than -2 z-score', value: '-1', operator: Answer.operators[:more_or_equal]},
                                ])
    
  end
end
