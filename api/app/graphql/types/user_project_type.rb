module Types
  class UserProjectType < Types::BaseObject
    field :user_id, ID
    field :project_id, ID
    field :is_admin, Boolean
  end
end