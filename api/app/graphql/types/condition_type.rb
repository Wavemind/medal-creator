module Types
  class ConditionType < Types::BaseObject
    field :answer, Types::AnswerType, null: false
    field :instance, Types::InstanceType, null: false
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :score, Integer
    field :answer_node, Types::InstanceType, null: false # TODO: Check

    def answer_node
      object.instance.instanceable.components.find_by(node: object.answer.node)
    end
  end
end
