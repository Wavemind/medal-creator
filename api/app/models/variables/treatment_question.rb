# Category of variable concerning variables for drugs
# Reference prefix : TQ
class Variables::TreatmentQuestion < Variable

  def self.variable
    'treatment_question'
  end

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:diagnosis_management]
    self.step = Variable.steps[:health_care_questions_step]
  end
end
