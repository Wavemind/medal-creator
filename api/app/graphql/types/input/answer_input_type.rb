module Types
  module Input
    class AnswerInputType < Types::BaseInputObject
      argument :reference, Integer, required: false
      argument :label_translations, Types::HstoreType, required: false
      argument :value, String, required: false
      argument :operator, String, required: false
      argument :is_unavailable, Boolean, required: false
    end
  end
end
