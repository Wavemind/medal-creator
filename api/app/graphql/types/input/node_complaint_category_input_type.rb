module Types
  module Input
    class NodeComplaintCategoryInputType < Types::BaseInputObject
      argument :node_id, ID, required: true
      argument :complaint_category_id, ID, required: true
      argument :_destroy, Boolean, required: false
    end
  end
end
