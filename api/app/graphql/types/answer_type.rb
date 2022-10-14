module Types
  class AnswerType < Types::BaseObject
    field :id, ID
    field :reference, Integer
    field :label_translations, Types::HstoreType
    field :value, String
    field :operator, String
    field :is_unavailable, Boolean
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
