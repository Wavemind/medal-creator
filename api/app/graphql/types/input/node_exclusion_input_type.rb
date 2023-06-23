module Types
  module Input
    class NodeExclusionInputType < Types::BaseInputObject
      argument :excluding_node_id, ID, required: false
      argument :excluded_node_id, ID, required: false
      argument :node_type, String, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
