module Types
  class ConditionType < Types::BaseObject
    field :answer, Types::AnswerType, null: false
    field :instance, Types::InstanceType, null: false
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :score, Integer
  end
end
