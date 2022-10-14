module Types
  class DecisionTreeType < Types::BaseObject
    field :id, ID, null: false
    field :label, String, null: false
    field :algorithm, Types::AlgorithmType
    field :node, Types::NodeType
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
