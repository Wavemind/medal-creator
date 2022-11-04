module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.
    field :get_user, resolver: Queries::Users::GetUser
    field :get_project, resolver: Queries::Projects::GetProject
    field :get_projects, resolver: Queries::Projects::GetProjects
    field :get_algorithm, resolver: Queries::Algorithms::GetAlgorithm
    field :get_algorithms, resolver: Queries::Algorithms::GetAlgorithms
  end
end
