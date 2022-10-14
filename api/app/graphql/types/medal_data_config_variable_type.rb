module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :id, ID, null: false
    field :algorithm, Types::AlgorithmType, null: false
    field :question, Types::QuestionType, null: false
    field :label, String, null: false
    field :api_key, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
