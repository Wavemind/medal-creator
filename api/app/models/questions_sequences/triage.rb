# Define a regular sequence of questions
# Reference prefix : TI
class QuestionsSequences::Triage < QuestionsSequence
  def self.policy_class
    QuestionsSequencePolicy
  end
end
