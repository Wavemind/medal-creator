module Types
  class ConditionType < Types::BaseObject
    field :answer, Types::AnswerType, null: false
    field :instance, Types::InstanceType, null: false
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :score, Integer
    field :parent_instance, Types::InstanceType, null: false
  end
end
