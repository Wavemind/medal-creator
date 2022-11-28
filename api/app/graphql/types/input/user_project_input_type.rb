module Types
  module Input
    class UserProjectInputType < Types::BaseInputObject
      argument :user_id, ID, required: false
      argument :project_id, ID, required: false
      argument :is_admin, Boolean, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
