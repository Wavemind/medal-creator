module Types
  class QuestionsSequenceType < Types::NodeType
    field :type, String, null: false
    field :min_score, Integer
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :answers, [Types::AnswerType], null: false
  end
end
