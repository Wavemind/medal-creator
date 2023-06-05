module Types
  class LanguageType < Types::BaseObject
    field :name, String, null: false
    field :code, String, null: false
  end
end
