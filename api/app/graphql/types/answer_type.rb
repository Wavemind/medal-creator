module Types
  class AnswerType < Types::BaseObject
    field :id, ID, null: true
    field :reference, Integer, null: true
    field :value, String, null: true
    field :value, String, null: true
    field :unavailable, Boolean, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
