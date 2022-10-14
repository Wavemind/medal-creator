module Types
  class AdministrationRouteType < Types::BaseObject
    field :category, String
    field :name_translations, Types::HstoreType
  end
end
