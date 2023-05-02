module Types
  class AnswerTypeType < Types::BaseObject
    field :display, String, resolver_method: :resolve_display
    field :value, String
  end
end
