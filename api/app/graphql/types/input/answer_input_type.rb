module Types
  module Input
    class AnswerInputType < Types::BaseInputObject
      argument :label_translations, Types::Input::HstoreInputType, required: false
      argument :value, String, required: false
      argument :operator, Types::Enum::OperatorEnum, required: false
      argument :is_unavailable, Boolean, required: false
    end
  end
end
