module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :algorithm, Types::AlgorithmType
    field :question, Types::QuestionType
    field :label, String
    field :api_key, String
  end
end
