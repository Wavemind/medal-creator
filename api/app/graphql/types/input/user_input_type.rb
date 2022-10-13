module Types
  module Input
    class UserInputType < Types::BaseInputObject
      argument :id, ID, required: false
      argument :first_name, String, required: false
      argument :last_name, String, required: false
      argument :email, String, required: false
      argument :password, String, required: false
      argument :password_confirmation, String, required: false
    end
  end
end
