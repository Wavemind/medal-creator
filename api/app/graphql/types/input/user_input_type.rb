module Types
  module Input
    class UserInputType < Types::BaseInputObject
      argument :first_name, String, required: true
      argument :last_name, String, required: true
      argument :email, String, required: true
      argument :role, Types::Enum::RoleEnum, required: true
      argument :password, String, required: false
      argument :password_confirmation, String, required: false
      argument :invitation_token, String, required: false
      argument :user_projects_attributes, [Types::Input::UserProjectInputType], required: false
    end
  end
end
