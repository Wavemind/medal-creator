module Types
  class ConditionType < Types::BaseObject
    field :id, ID, null: false
    field :answer, Types::AnswerType, null: false
    field :instance, Types::InstanceType, null: false
    field :cut_off_start, Integer, null: false
    field :cut_off_end, Integer, null: false
    field :score, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
