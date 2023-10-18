module Types
  class MutationType < Types::BaseObject

    # TODO: Check if every query should be null: false. Cause we always have the object return OR a graphql error

    # User
    field :create_user, mutation: Mutations::Users::CreateUser
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :accept_invitation, mutation: Mutations::Users::AcceptInvitation
    field :lock_user, mutation: Mutations::Users::LockUser
    field :unlock_user, mutation: Mutations::Users::UnlockUser
    field :resend_invitation, mutation: Mutations::Users::ResendInvitation

    # Project
    field :create_project, mutation: Mutations::Projects::CreateProject, null: false
    field :update_project, mutation: Mutations::Projects::UpdateProject
    field :unsubscribe_from_project, mutation: Mutations::Projects::UnsubscribeFromProject

    # Algorithm
    field :create_algorithm, mutation: Mutations::Algorithms::CreateAlgorithm
    field :update_algorithm, mutation: Mutations::Algorithms::UpdateAlgorithm
    field :destroy_algorithm, mutation: Mutations::Algorithms::DestroyAlgorithm
    field :import_translations, mutation: Mutations::Algorithms::ImportTranslations

    # Decision Tree
    field :create_decision_tree, mutation: Mutations::DecisionTrees::CreateDecisionTree, null: false
    field :update_decision_tree, mutation: Mutations::DecisionTrees::UpdateDecisionTree
    field :destroy_decision_tree, mutation: Mutations::DecisionTrees::DestroyDecisionTree
    field :duplicate_decision_tree, mutation: Mutations::DecisionTrees::DuplicateDecisionTree

    # Diagnosis
    field :create_diagnosis, mutation: Mutations::Diagnoses::CreateDiagnosis, null: false
    field :update_diagnosis, mutation: Mutations::Diagnoses::UpdateDiagnosis, null: false
    field :destroy_diagnosis, mutation: Mutations::Diagnoses::DestroyDiagnosis

    # Variable
    field :create_variable, mutation: Mutations::Variables::CreateVariable, null: false
    field :update_variable, mutation: Mutations::Variables::UpdateVariable, null: false
    field :destroy_variable, mutation: Mutations::Variables::DestroyVariable
    field :duplicate_variable, mutation: Mutations::Variables::DuplicateVariable

    # Questions sequence
    field :create_questions_sequence, mutation: Mutations::QuestionsSequences::CreateQuestionsSequence, null: false
    field :update_questions_sequence, mutation: Mutations::QuestionsSequences::UpdateQuestionsSequence, null: false
    field :destroy_questions_sequence, mutation: Mutations::QuestionsSequences::DestroyQuestionsSequence

    # Drug
    field :create_drug, mutation: Mutations::Drugs::CreateDrug
    field :update_drug, mutation: Mutations::Drugs::UpdateDrug
    field :destroy_drug, mutation: Mutations::Drugs::DestroyDrug

    # Management
    field :create_management, mutation: Mutations::Managements::CreateManagement
    field :update_management, mutation: Mutations::Managements::UpdateManagement
    field :destroy_management, mutation: Mutations::Managements::DestroyManagement

    # Node Exclusion
    field :create_node_exclusions, mutation: Mutations::NodeExclusions::CreateNodeExclusions
    field :destroy_node_exclusion, mutation: Mutations::NodeExclusions::DestroyNodeExclusion

    # Instance
    field :create_instance, mutation: Mutations::Instances::CreateInstance, null: false
    field :update_instance, mutation: Mutations::Instances::UpdateInstance, null: false
    field :destroy_instance, mutation: Mutations::Instances::DestroyInstance

    # Condition
    field :create_condition, mutation: Mutations::Conditions::CreateCondition, null: false
    field :update_condition, mutation: Mutations::Conditions::UpdateCondition, null: false
    field :destroy_condition, mutation: Mutations::Conditions::DestroyCondition

    # 2FA
    field :enable_2fa, mutation: Mutations::TwoFactor::Enable2fa
    field :disable_2fa, mutation: Mutations::TwoFactor::Disable2fa
  end
end
