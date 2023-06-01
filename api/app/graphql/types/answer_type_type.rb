module Types
  class AnswerTypeType < Types::BaseObject
    field :display, String, resolver_method: :resolve_display, null: false
    field :value, String, null: false
  end
end
