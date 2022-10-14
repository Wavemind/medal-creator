module Types
  class ConditionType < Types::BaseObject
    field :id, ID
    field :answer, Types::AnswerType
    field :instance, Types::InstanceType
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :score, Integer
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
