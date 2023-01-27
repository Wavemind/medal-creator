# Category of question to complement basic measurements questions
# Reference prefix : AM
class Questions::AnswerableBasicMeasurement < Question
  def self.policy_class
    QuestionPolicy
  end
end
