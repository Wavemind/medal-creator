module Types
  module Input
    class AnswerInputType < Types::BaseInputObject
      argument :label_translations, Types::Input::HstoreInputType, required: false
      argument :value, String, required: false
      argument :operator, Types::Enum::OperatorEnum, required: false
    end
  end
end
