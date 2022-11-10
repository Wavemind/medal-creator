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
    field :algorithms_count, Integer
    field :questions, [Types::QuestionType]
    field :questions_count, Integer
    field :drugs, [Types::DrugType]
    field :drugs_count, Integer
    field :managements, [Types::ManagementType]
    field :managements_count, Integer
    field :questions_sequences, [Types::QuestionsSequenceType]
    field :questions_sequences_count, Integer
    field :user_projects, [Types::UserProjectType]
    field :language, Types::LanguageType
    field :last_updated_decision_trees, [Types::DecisionTreeType], null: false

    def algorithms_count
      object.algorithms.size
    end
    
    def questions_count
      object.questions.size
    end

    def drugs_count
      object.drugs.size
    end

    def managements_count
      object.managements.size
    end

    def questions_sequences_count
      object.questions_sequences.size
    end

    # Check if lastUpdated or lastOpened
    def last_updated_decision_trees
      object.algorithms.map(&:decision_trees).flatten.sort { |a, b| b.updated_at <=> a.updated_at }.first(10)
    end
  end
end
