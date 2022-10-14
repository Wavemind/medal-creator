module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :id, ID, null: true
    field :algorithm, Types::AlgorithmType, null: true
    field :question, Types::QuestionType, null: true
    field :label, String, null: true
    field :api_key, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
