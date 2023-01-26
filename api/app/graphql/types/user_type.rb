module Types
  class UserType < Types::BaseObject
    field :first_name, String
    field :last_name, String
    field :email, String
    field :role, String
    field :password, String
    field :password_confirmation, String
    field :locked_at, String
    field :user_projects, [Types::UserProjectType]
  end
end
