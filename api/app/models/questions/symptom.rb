# Category of question concerning the symptoms of the patient
# Reference prefix : S
class Questions::Symptom < Question

  def self.policy_class
    QuestionPolicy
  end

end
