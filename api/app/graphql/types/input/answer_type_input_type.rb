module Types
  module Input
    class AnswerTypeInputType < Types::BaseInputObject
      argument :display, String, required: false
      argument :value, String, required: false
    end
  end
end
