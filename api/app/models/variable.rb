# Child of Node / Variables asked to the patient
class Variable < Node
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
    urinary_reproductiveaa
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
                              where.not(type: %w[Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::ConsultationRelated Variables::Referral])
                            }

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
end
