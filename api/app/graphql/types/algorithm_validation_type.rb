module Types
  class AlgorithmValidationType < Types::BaseObject
    field :invalid_decision_trees, [Types::DecisionTreeType], null: false
    field :missing_nodes, [Types::NodeType], null: false
  end
end
