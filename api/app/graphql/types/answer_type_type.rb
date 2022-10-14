module Types
  class AnswerTypeType < Types::BaseObject
    field :id, ID, null: false
    field :display, String, null: false
    field :value, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
