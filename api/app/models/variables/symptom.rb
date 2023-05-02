# Category of variable concerning the symptoms of the patient
# Reference prefix : S
class Variables::Symptom < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:medical_history_step]
  end
end
