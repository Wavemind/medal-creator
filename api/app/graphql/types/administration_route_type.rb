module Types
  class AdministrationRouteType < Types::BaseObject
    field :category, String, null: false
    field :name_translations, Types::HstoreType, null: false
  end
end
