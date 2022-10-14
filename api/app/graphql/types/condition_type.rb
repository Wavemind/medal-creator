module Types
  class ConditionType < Types::BaseObject
    field :id, ID, null: true
    field :answer, Types::AnswerType, null: true
    field :instance, Types::InstanceType, null: true
    field :cut_off_start, Integer, null: true
    field :cut_off_end, Integer, null: true
    field :score, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
