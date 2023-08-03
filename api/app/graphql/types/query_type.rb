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
    field :get_administration_routes, resolver: Queries::AdministrationRoutes::GetAdministrationRoutes

    # Algorithm
    field :get_algorithm, resolver: Queries::Algorithms::GetAlgorithm
    field :get_algorithms, resolver: Queries::Algorithms::GetAlgorithms
    field :export_data, resolver: Queries::Algorithms::ExportData

    # Decision trees
    field :get_decision_tree, resolver: Queries::DecisionTrees::GetDecisionTree
    field :get_decision_trees, resolver: Queries::DecisionTrees::GetDecisionTrees
    field :get_last_updated_decision_trees, resolver: Queries::DecisionTrees::GetLastUpdatedDecisionTrees

    # Diagnoses
    field :get_diagnoses, resolver: Queries::Diagnoses::GetDiagnoses
    field :get_diagnosis, resolver: Queries::Diagnoses::GetDiagnosis

    # Variables
    field :get_complaint_categories, resolver: Queries::Variables::GetComplaintCategories
    field :get_formula_variables, resolver: Queries::Variables::GetFormulaVariables
    field :get_variable, resolver: Queries::Variables::GetVariable
    field :get_variables, resolver: Queries::Variables::GetVariables

    # Drugs
    field :get_drug, resolver: Queries::Drugs::GetDrug
    field :get_drugs, resolver: Queries::Drugs::GetDrugs

    # Managements
    field :get_management, resolver: Queries::Managements::GetManagement
    field :get_managements, resolver: Queries::Managements::GetManagements

    # Questions sequences
    field :get_questions_sequence, resolver: Queries::QuestionsSequences::GetQuestionsSequence
    field :get_questions_sequences, resolver: Queries::QuestionsSequences::GetQuestionsSequences

    # Diagrams
    field :get_components, resolver: Queries::Diagrams::GetComponents
    field :get_available_nodes, resolver: Queries::Diagrams::GetAvailableNodes
    field :validate, resolver: Queries::Diagrams::Validate

    # Instances
    field :get_instance, resolver: Queries::Instances::GetInstance
    field :get_instances, resolver: Queries::Instances::GetInstances
  end
end
