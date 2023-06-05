module Types
  class AnswerType < Types::BaseObject
    field :reference, Integer, null: false
    field :label_translations, Types::HstoreType, null: false
    field :value, String, null: false
    field :operator, Types::Enum::OperatorEnum
    field :is_unavailable, Boolean, null: false
  end
end
