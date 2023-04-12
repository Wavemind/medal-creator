# Category of variable concerning questions for drugs
# Reference prefix : TQ
class Variables::TreatmentQuestion < Variable

  def self.variable
    'treatment_question'
  end

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:health_care_questions_step]
  end
end
