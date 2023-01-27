# Category of question who defines first basic question to possibly improve priority of a patient
# Reference prefix : UT
class Questions::UniqueTriageQuestion < Question
  def self.policy_class
    QuestionPolicy
  end
end
