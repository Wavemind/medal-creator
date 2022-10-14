module Types
  class AdministrationRouteType < Types::BaseObject
    field :id, ID, null: true
    field :category, String, null: true
    field :name_translations, Types::HstoreType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
