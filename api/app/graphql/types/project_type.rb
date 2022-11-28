module Types
  class ProjectType < Types::BaseObject
    field :name, String
    field :consent_management, Boolean
    field :track_referral, Boolean
    field :description, String
    field :study_description_translations, Types::HstoreType
    field :emergency_content_translations, Types::HstoreType
    field :emergency_content_version, Integer
    field :medal_r_config, GraphQL::Types::JSON
    field :village_json, GraphQL::Types::JSON
    field :algorithms, [Types::AlgorithmType]
    field :questions, [Types::QuestionType]
    field :drugs, [Types::DrugType]
    field :managements, [Types::ManagementType]
    field :questions_sequences, [Types::QuestionsSequenceType]
    field :user_projects, [Types::UserProjectType]
    field :language, Types::LanguageType
    field :last_updated_decision_trees, [Types::DecisionTreeType], null: false
    field :is_current_user_admin, Boolean

    # Check if lastUpdated or lastOpened
    def last_updated_decision_trees
      object.algorithms.map(&:decision_trees).flatten.sort { |a, b| b.updated_at <=> a.updated_at }.first(10)
    end

    def is_current_user_admin
      context[:current_api_v1_user].admin? || object.user_projects.where(user: context[:current_api_v1_user],
                                                                         is_admin: true).exists?
    end
  end
end
