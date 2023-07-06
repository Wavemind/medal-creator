module Types
  module Input
    class TwoFaInputType < Types::BaseInputObject
      argument :user_id, ID, required: false
      argument :code, String, required: false
      argument :password, String, required: false
    end
  end
end
