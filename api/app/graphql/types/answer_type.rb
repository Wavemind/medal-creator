module Types
  class AnswerType < Types::BaseObject
    field :id, ID, null: false
    field :reference, Integer, null: false
    field :value, String, null: false
    field :value, String, null: false
    field :unavailable, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
