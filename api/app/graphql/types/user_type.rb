module Types
  class UserType < Types::BaseObject
    field :first_name, String
    field :last_name, String
    field :email, String
    field :password, String
    field :password_confirmation, String
  end
end
