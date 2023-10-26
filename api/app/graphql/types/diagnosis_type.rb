module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer, null: false
    field :components, [Types::InstanceType], null: false
    field :decision_tree, Types::DecisionTreeType, null: false
  end
end
