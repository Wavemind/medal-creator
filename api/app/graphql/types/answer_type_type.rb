module Types
  class AnswerTypeType < Types::BaseObject
    field :id, ID, null: true
    field :display, String, null: true
    field :value, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
