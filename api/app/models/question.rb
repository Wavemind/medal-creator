# Child of Node / Questions asked to the patient
class Question < Node
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
  belongs_to :reference_table_x, class_name: 'Question', optional: true
  belongs_to :reference_table_y, class_name: 'Question', optional: true
  belongs_to :reference_table_z, class_name: 'Question', optional: true

  has_many :answers, foreign_key: 'node_id', dependent: :destroy
  has_many :node_complaint_categories, foreign_key: 'node_id', dependent: :destroy # Complaint category linked to the question
  has_many :complaint_categories, through: :node_complaint_categories

  scope :no_treatment_condition, -> { where.not(type: 'Questions::TreatmentQuestion') }
  scope :diagrams_included, lambda {
                              where.not(type: %w[Questions::VitalSignAnthropometric Questions::BasicMeasurement Questions::BasicDemographic Questions::ConsultationRelated Questions::Referral])
                            }

  accepts_nested_attributes_for :answers, allow_destroy: true

  # Preload the children of class Question
  def self.descendants
    [
      Questions::AnswerableBasicMeasurement,
      Questions::AssessmentTest,
      Questions::BackgroundCalculation,
      Questions::BasicMeasurement,
      Questions::ChronicCondition,
      Questions::ComplaintCategory,
      Questions::BasicDemographic,
      Questions::Demographic,
      Questions::Exposure,
      Questions::ObservedPhysicalSign,
      Questions::PhysicalExam,
      Questions::Referral,
      Questions::Symptom,
      Questions::TreatmentQuestion,
      Questions::UniqueTriageQuestion,
      Questions::Vaccine,
      Questions::VitalSignAnthropometric
    ]
  end
end
