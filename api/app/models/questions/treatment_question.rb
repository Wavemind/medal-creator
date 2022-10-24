# Category of question concerning question for drugs
# Reference prefix : TQ
class Questions::TreatmentQuestion < Question

  def self.policy_class
    QuestionPolicy
  end

  def self.variable
    'treatment_question'
  end

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Question.steps[:health_care_questions_step]
  end
end
