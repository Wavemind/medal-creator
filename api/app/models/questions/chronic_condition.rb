# Category of question who defines other condition that might influence the present patient condition
# Reference prefix : CH
class Questions::ChronicCondition < Question
  def self.policy_class
    QuestionPolicy
  end
end
