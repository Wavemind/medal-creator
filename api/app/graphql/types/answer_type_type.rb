module Types
  class AnswerTypeType < Types::BaseObject
<<<<<<< HEAD
    field :display, String, resolver_method: :resolve_display
    field :value, String
    field :label_key, String
=======
    field :display, String, resolver_method: :resolve_display, null: false
    field :value, String, null: false
>>>>>>> feature/create-qs
  end
end
