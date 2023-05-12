module Types
  module Input
    class MedalDataConfigVariableInputType < Types::BaseInputObject
      argument :algorithm_id, ID, required: false
      argument :variable_id, ID, required: false
      argument :label, String, required: false
      argument :api_key, String, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
