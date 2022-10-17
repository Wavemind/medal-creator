module Types
  class QuestionsSequenceType < Types::NodeType
    field :min_score, Integer
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :answers, [Types::AnswerType]
    field :components, [Types::InstanceType]
  end
end
