module Types
  class NodeComplaintCategoryType < Types::BaseObject
    field :node_id, ID
    field :complaint_category, Types::VariableType
  end
end
