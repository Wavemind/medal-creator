module Types
  class AnswerType < Types::BaseObject
    field :reference, Integer
    field :label_translations, Types::HstoreType
    field :value, String
    field :operator, Types::Enum::OperatorEnum
    field :is_unavailable, Boolean
  end
end
