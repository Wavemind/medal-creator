module Types
  module Input
    class MedalDataConfigVariableInputType < Types::BaseInputObject
      argument :algorithm_id, ID, required: true
      argument :variable_id, ID, required: true
      argument :label, String, required: true
      argument :api_key, String, required: true
      argument :_destroy, Boolean, required: false
    end
  end
end
