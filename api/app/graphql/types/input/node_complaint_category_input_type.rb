module Types
  module Input
    class NodeComplaintCategoryInputType < Types::BaseInputObject
      argument :node_id, ID, required: false
      argument :complaint_category_id, ID, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
