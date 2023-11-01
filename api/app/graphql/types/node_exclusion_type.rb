module Types
  class NodeExclusionType < Types::BaseObject
    field :excluding_node, Types::NodeType, null: false
    field :excluded_node, Types::NodeType, null: false
  end
end
