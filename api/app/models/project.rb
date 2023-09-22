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
    age_in_days = variables.create!(label_en: I18n.t('en.variables.default_variables.age_in_days'), label_fr: I18n.t('fr.variables.default_variables.age_in_days'), type: 'Variables::BasicDemographic', stage: Variable.stages[:registration], is_mandatory: true, answer_type_id: 5, formula: 'ToDay', is_default: true)
    weight = variables.create!(label_en: I18n.t('en.variables.default_variables.weight'), label_fr: I18n.t('fr.variables.default_variables.weight'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 4, is_estimable: true, is_default: true)
    rr = variables.create!(label_en: I18n.t('en.variables.default_variables.respiratory_rate'), label_fr: I18n.t('fr.variables.default_variables.respiratory_rate'), type: 'Variables::VitalSignAnthropometric', stage: Variable.stages[:consultation], answer_type_id: 4, system: Variable.systems[:vital_sign], is_default: true)
    muac = variables.create!(label_en: I18n.t('en.variables.default_variables.muac'), label_fr: I18n.t('fr.variables.default_variables.muac'), type: 'Variables::BasicMeasurement', description_en: 'Mid Upper Arm Circumference', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    gender = variables.create!(label_en: I18n.t('en.variables.default_variables.gender'), label_fr: I18n.t('fr.variables.default_variables.gender'), type: 'Variables::Demographic', stage: Variable.stages[:registration], answer_type_id: 2, is_mandatory: true, is_default: true)
    height = variables.create!(label_en: I18n.t('en.variables.default_variables.height'), label_fr: I18n.t('fr.variables.default_variables.height'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    length = variables.create!(label_en: I18n.t('en.variables.default_variables.length'), label_fr: I18n.t('fr.variables.default_variables.length'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    bmi = variables.create!(label_en: I18n.t('en.variables.default_variables.bmi'), label_fr: I18n.t('fr.variables.default_variables.bmi'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:registration], answer_type_id: 5, formula: '[BM1] / (([BM3] / 100) * ([BM3] / 100))', is_default: true)
    temperature = variables.create!(label_en: I18n.t('en.variables.default_variables.temperature'), label_fr: I18n.t('fr.variables.default_variables.temperature'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], answer_type_id: 4, is_default: true)
    cc_general = variables.create!(label_en: I18n.t('en.variables.default_variables.cc_general'), label_fr: I18n.t('fr.variables.default_variables.cc_general'), type: 'Variables::ComplaintCategory', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 1, is_default: true)
    yi_cc_general = variables.create!(label_en: I18n.t('en.variables.default_variables.cc_general_yi'), label_fr: I18n.t('fr.variables.default_variables.cc_general_yi'), type: 'Variables::ComplaintCategory', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 1, is_default: true, is_neonat: true)
    village = variables.create!(label_en: I18n.t('en.variables.default_variables.village'), label_fr: I18n.t('fr.variables.default_variables.village'), type: 'Variables::BasicDemographic', stage: Variable.stages[:registration], answer_type_id: 9, is_mandatory: true, is_identifiable: true, is_default: true)
    kind_of_consultation = variables.create!(label_en: I18n.t('en.variables.default_variables.kind_of_consultation'), label_fr: I18n.t('fr.variables.default_variables.kind_of_consultation'), type: 'Variables::Demographic', stage: Variable.stages[:registration], answer_type_id: 2, is_mandatory: true, is_default: true)

    wh = variables.new(label_en: I18n.t('en.variables.default_variables.measure_height'), label_fr: I18n.t('fr.variables.default_variables.measure_height'), type: 'Variables::BasicMeasurement', stage: Variable.stages[:triage], is_mandatory: true, answer_type_id: 2, is_default: true)
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
                            {label_en: I18n.t('en.variables.default_variables.gender_answers.male'), label_fr: I18n.t('fr.variables.default_variables.gender_answers.male'), value: 'male'},
                            {label_en: I18n.t('en.variables.default_variables.gender_answers.female'), label_fr: I18n.t('fr.variables.default_variables.gender_answers.female'), value: 'female'}
                          ])

    kind_of_consultation.answers.create([
                                          {label_en: I18n.t('en.variables.default_variables.kind_of_consultation_answers.self_referral'), label_fr: I18n.t('fr.variables.default_variables.kind_of_consultation_answers.self_referral')},
                                          {label_en: I18n.t('en.variables.default_variables.kind_of_consultation_answers.referral_other_facility'), label_fr: I18n.t('fr.variables.default_variables.kind_of_consultation_answers.referral_other_facility')},
                                          {label_en: I18n.t('en.variables.default_variables.kind_of_consultation_answers.scheduled_follow_up'), label_fr: I18n.t('fr.variables.default_variables.kind_of_consultation_answers.scheduled_follow_up')},
                                          {label_en: I18n.t('en.variables.default_variables.kind_of_consultation_answers.unscheduled_follow_up'), label_fr: I18n.t('fr.variables.default_variables.kind_of_consultation_answers.unscheduled_follow_up')}
                                        ])

    age = variables.create!(label_en: I18n.t('en.variables.default_variables.age_in_months'), label_fr: I18n.t('fr.variables.default_variables.age_in_months'), type: 'Variables::BackgroundCalculation', is_mandatory: true, answer_type_id: 5, formula: 'ToMonth', is_default: true)
    age.answers.create([
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.less_2'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.less_2'), value: '2', operator: Answer.operators[:less]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.2_to_6'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.2_to_6'), value: '2, 6', operator: Answer.operators[:between]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.6_to_12'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.6_to_12'), value: '6, 12', operator: Answer.operators[:between]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.12_to_24'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.12_to_24'), value: '12, 24', operator: Answer.operators[:between]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.24_to_36'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.24_to_36'), value: '24, 36', operator: Answer.operators[:between]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.36_to_60'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.36_to_60'), value: '36, 60', operator: Answer.operators[:between]},
                         {label_en: I18n.t('en.variables.default_variables.age_in_months_answers.more_60'), label_fr: I18n.t('fr.variables.default_variables.age_in_months_answers.more_60'), value: '60', operator: Answer.operators[:more_or_equal]},
                       ])

    z_score = variables.create!(label_en: I18n.t('en.variables.default_variables.wfa'), label_fr: I18n.t('fr.variables.default_variables.wfa'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: weight.id, reference_table_male_name: "z_score_male_table", reference_table_female_name: "z_score_female_table", is_default: true)
    z_score.answers.create([
                             {label_en: I18n.t('en.variables.default_variables.z_score_answers.less_-2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.less_-2'), value: '-2', operator: Answer.operators[:less]},
                             {label_en: I18n.t('en.variables.default_variables.z_score_answers.minus_2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.minus_2'), value: '-2, -1', operator: Answer.operators[:between]},
                             {label_en: I18n.t('en.variables.default_variables.z_score_answers.more_-3'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.more_-3'), value: '-1', operator: Answer.operators[:more_or_equal]},
                           ])

    bmi_z_score = variables.create!(label_en: I18n.t('en.variables.default_variables.bmi_z_score'), label_fr: I18n.t('fr.variables.default_variables.bmi_z_score'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: bmi.id, reference_table_male_name: "bmi_for_age_male_table", reference_table_female_name: "bmi_for_age_female_table", is_default: true)
    bmi_z_score.answers.create([
                                 {label_en: I18n.t('en.variables.default_variables.z_score_answers.less_-2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.less_-2'), value: '-2', operator: Answer.operators[:less]},
                                 {label_en: I18n.t('en.variables.default_variables.z_score_answers.minus_2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.minus_2'), value: '-2, -1', operator: Answer.operators[:between]},
                                 {label_en: I18n.t('en.variables.default_variables.z_score_answers.more_-3'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.more_-3'), value: '-1', operator: Answer.operators[:more_or_equal]},
                               ])

    weight_for_height = variables.create!(label_en: I18n.t('en.variables.default_variables.wfh'), label_fr: I18n.t('fr.variables.default_variables.wfh'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: height.id, reference_table_y_id: weight.id, reference_table_male_name: "weight_for_height_male_table", reference_table_female_name: "weight_for_height_female_table", is_default: true)
    weight_for_height.answers.create([
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.less_-2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.less_-2'), value: '-2', operator: Answer.operators[:less]},
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.minus_2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.minus_2'), value: '-2, -1', operator: Answer.operators[:between]},
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.more_-3'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.more_-3'), value: '-1', operator: Answer.operators[:more_or_equal]},
                                     ])

    weight_for_length = variables.create!(label_en: I18n.t('en.variables.default_variables.wfl'), label_fr: I18n.t('fr.variables.default_variables.wfl'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: length.id, reference_table_y_id: weight.id, reference_table_male_name: "weight_for_length_male_table", reference_table_female_name: "weight_for_length_female_table", is_default: true)
    weight_for_length.answers.create([
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.less_-2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.less_-2'), value: '-2', operator: Answer.operators[:less]},
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.minus_2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.minus_2'), value: '-2, -1', operator: Answer.operators[:between]},
                                       {label_en: I18n.t('en.variables.default_variables.z_score_answers.more_-3'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.more_-3'), value: '-1', operator: Answer.operators[:more_or_equal]},
                                     ])

    rr_th = variables.create!(label_en: I18n.t('en.variables.default_variables.respiratory_rate_percentile'), label_fr: I18n.t('fr.variables.default_variables.respiratory_rate_percentile'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age.id, reference_table_y_id: temperature.id, reference_table_z_id: rr.id, reference_table_male_name: "respiratory_rate_table", reference_table_female_name: "respiratory_rate_table", is_default: true)
    rr_th.answers.create([
                           {label_en: I18n.t('en.variables.default_variables.respiratory_rate_percentile_answers.less_75'), label_fr: I18n.t('fr.variables.default_variables.respiratory_rate_percentile_answers.less_75'), value: '75', operator: Answer.operators[:less]},
                           {label_en: I18n.t('en.variables.default_variables.respiratory_rate_percentile_answers.75_to_97'), label_fr: I18n.t('fr.variables.default_variables.respiratory_rate_percentile_answers.75_to_97'), value: '75, 97', operator: Answer.operators[:between]},
                           {label_en: I18n.t('en.variables.default_variables.respiratory_rate_percentile_answers.more_97'), label_fr: I18n.t('fr.variables.default_variables.respiratory_rate_percentile_answers.more_97'), value: '97', operator: Answer.operators[:more_or_equal]},
                         ])

    muac_z_score = variables.create!(label_en: I18n.t('en.variables.default_variables.muac_z_score'), label_fr: I18n.t('fr.variables.default_variables.muac_z_score'), type: 'Variables::BackgroundCalculation', answer_type_id: 3, reference_table_x_id: age_in_days.id, reference_table_y_id: muac.id, reference_table_male_name: "muac_z_score_male_table", reference_table_female_name: "muac_z_score_female_table", is_default: true)
    muac_z_score.answers.create([
                                  {label_en: I18n.t('en.variables.default_variables.z_score_answers.less_-2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.less_-2'), value: '-2', operator: Answer.operators[:less]},
                                  {label_en: I18n.t('en.variables.default_variables.z_score_answers.minus_2'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.minus_2'), value: '-2, -1', operator: Answer.operators[:between]},
                                  {label_en: I18n.t('en.variables.default_variables.z_score_answers.more_-3'), label_fr: I18n.t('fr.variables.default_variables.z_score_answers.more_-3'), value: '-1', operator: Answer.operators[:more_or_equal]},
                                ])
    
  end
end
