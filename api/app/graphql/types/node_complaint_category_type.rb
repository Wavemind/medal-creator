module Types
  class NodeComplaintCategoryType < Types::BaseObject
    field :node_id, ID, null: false
    field :complaint_category, Types::VariableType, null: false
  end
end
