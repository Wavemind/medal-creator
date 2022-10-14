module Types
  class AnswerTypeType < Types::BaseObject
    field :id, ID
    field :display, String
    field :value, String
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
