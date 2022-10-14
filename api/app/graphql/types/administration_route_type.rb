module Types
  class AdministrationRouteType < Types::BaseObject
    field :id, ID, null: false
    field :category, String, null: false
    field :name_translations, Types::HstoreType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
