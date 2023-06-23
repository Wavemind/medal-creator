module Types
  class NodeExclusionType < Types::BaseObject
    field :excluding_node_id, ID, null: false
    field :excluded_node_id, ID, null: false
  end
end
