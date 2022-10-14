module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :id, ID
    field :algorithm, Types::AlgorithmType
    field :question, Types::QuestionType
    field :label, String
    field :api_key, String
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
