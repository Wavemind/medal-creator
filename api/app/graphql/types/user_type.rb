module Types
  class UserType < Types::BaseObject
    field :first_name, String, null: false
    field :last_name, String, null: false
    field :email, String, null: false
    field :role, Types::Enum::RoleEnum, null: false
    field :password, String
    field :password_confirmation, String
    field :locked_at, GraphQL::Types::ISO8601DateTime
    field :invitation_accepted_at, GraphQL::Types::ISO8601DateTime
    field :invitation_created_at, GraphQL::Types::ISO8601DateTime
    field :user_projects, [Types::UserProjectType], null: false
    field :otp_required_for_login, Boolean
    field :otp_provisioning_uri, String
    field :otp_secret, String
  end
end
