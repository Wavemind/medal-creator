module Types
  class ProjectType < Types::BaseObject
    field :name, String, null: false
    field :consent_management, Boolean, null: false
    field :track_referral, Boolean, null: false
    field :description, String
    field :study_description_translations, Types::HstoreType
    field :emergency_content_translations, Types::HstoreType
    field :emergency_content_version, Integer
    field :medal_r_config, GraphQL::Types::JSON
    field :village_json, GraphQL::Types::JSON
    field :algorithms, [Types::AlgorithmType], null: false
    field :algorithms_count, Integer
    field :variables, [Types::VariableType], null: false
    field :variables_count, Integer
    field :drugs, [Types::DrugType], null: false
    field :drugs_count, Integer
    field :managements, [Types::ManagementType], null: false
    field :managements_count, Integer
    field :questions_sequences, [Types::QuestionsSequenceType], null: false
    field :questions_sequences_count, Integer
    field :user_projects, [Types::UserProjectType], null: false
    field :language, Types::LanguageType, null: false
    field :is_current_user_admin, Boolean
    field :formatted_basic_questions, [Types::MedalDataConfigVariableType], null: false

    def algorithms_count
      object.algorithms.size
    end

    def variables_count
      object.variables.size
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

    def is_current_user_admin
      context[:current_api_v2_user].admin? || object.user_projects.where(user: context[:current_api_v2_user],
                                                                         is_admin: true).exists?
    end
  end
end
