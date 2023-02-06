module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.
    field :get_user, resolver: Queries::Users::GetUser
    field :get_users, resolver: Queries::Users::GetUsers
    field :get_project, resolver: Queries::Projects::GetProject
    field :get_projects, resolver: Queries::Projects::GetProjects
    field :get_languages, resolver: Queries::Languages::GetLanguages
    field :get_algorithm, resolver: Queries::Algorithms::GetAlgorithm
    field :get_algorithms, resolver: Queries::Algorithms::GetAlgorithms
    field :get_decision_tree, resolver: Queries::DecisionTrees::GetDecisionTree
    field :get_decision_trees, resolver: Queries::DecisionTrees::GetDecisionTrees
    field :get_last_updated_decision_trees, resolver: Queries::DecisionTrees::GetLastUpdatedDecisionTrees
    field :get_diagnoses, resolver: Queries::Diagnoses::GetDiagnoses
    field :get_complaint_categories, resolver: Queries::Nodes::GetComplaintCategories
  end
end
