module Types
  module Input
    class MedalDataConfigVariableInputType < Types::BaseInputObject
      argument :algorithm, Types::AlgorithmType, required: false
      argument :question, Types::QuestionType, required: false
      argument :label, String, required: false
      argument :api_key, String, required: false
    end
  end
end
