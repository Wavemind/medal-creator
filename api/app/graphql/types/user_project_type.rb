module Types
  class UserProjectType < Types::BaseObject
    field :user_id, ID, null: false
    field :project_id, ID, null: false
    field :is_admin, Boolean, null: false
    field :project, Types::ProjectType
  end
end
