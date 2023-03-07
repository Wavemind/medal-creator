module Types
  module Input
    class TwoFaInputType < Types::BaseInputObject
      argument :user_id, Integer, required: false
      argument :code, String, required: false
      argument :password, String, required: false
    end
  end
end
