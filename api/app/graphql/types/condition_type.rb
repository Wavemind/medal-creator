module Types
  class ConditionType < Types::BaseObject
    field :answer, Types::AnswerType
    field :instance, Types::InstanceType
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :score, Integer
  end
end
