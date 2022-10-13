module Types
  class AlgorithmType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :description, String, null: true
    field :project, Types::ProjectType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
