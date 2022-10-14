module Types
  class AdministrationRouteType < Types::BaseObject
    field :id, ID
    field :category, String
    field :name_translations, Types::HstoreType
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
