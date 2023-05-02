module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Users
    field :get_user, resolver: Queries::Users::GetUser
    field :get_users, resolver: Queries::Users::GetUsers

    # Two Factor
    field :get_otp_required_for_login, resolver: Queries::TwoFactor::GetOtpRequiredForLogin
    field :get_qr_code_uri, resolver: Queries::TwoFactor::GetQrCodeUri

    # Projects
    field :get_project, resolver: Queries::Projects::GetProject
    field :get_projects, resolver: Queries::Projects::GetProjects

    # Other
    field :get_answer_types, resolver: Queries::AnswerTypes::GetAnswerTypes
    field :get_languages, resolver: Queries::Languages::GetLanguages

    # Algorithm
    field :get_algorithm, resolver: Queries::Algorithms::GetAlgorithm
    field :get_algorithms, resolver: Queries::Algorithms::GetAlgorithms

    # Decision trees
    field :get_decision_tree, resolver: Queries::DecisionTrees::GetDecisionTree
    field :get_decision_trees, resolver: Queries::DecisionTrees::GetDecisionTrees
    field :get_last_updated_decision_trees, resolver: Queries::DecisionTrees::GetLastUpdatedDecisionTrees

    # Diagnoses
    field :get_diagnoses, resolver: Queries::Diagnoses::GetDiagnoses
    field :get_diagnosis, resolver: Queries::Diagnoses::GetDiagnosis

    # Nodes
    field :get_complaint_categories, resolver: Queries::Nodes::GetComplaintCategories
    field :get_variables, resolver: Queries::Nodes::GetVariables
  end
end
