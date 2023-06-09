module Types
  module Input
    class AnswerInputType < Types::BaseInputObject
      argument :label_translations, Types::Input::HstoreInputType, required: true
      argument :value, String, required: false
      argument :operator, Types::Enum::OperatorEnum, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
