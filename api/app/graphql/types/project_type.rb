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
    field :variables, [Types::VariableType]
    field :variables_count, Integer
    field :drugs, [Types::DrugType]
    field :drugs_count, Integer
    field :managements, [Types::ManagementType]
    field :managements_count, Integer
    field :questions_sequences, [Types::QuestionsSequenceType]
    field :questions_sequences_count, Integer
    field :user_projects, [Types::UserProjectType]
    field :language, Types::LanguageType
    field :is_current_user_admin, Boolean

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
      context[:current_api_v1_user].admin? || object.user_projects.where(user: context[:current_api_v1_user],
                                                                         is_admin: true).exists?
    end
  end
end
