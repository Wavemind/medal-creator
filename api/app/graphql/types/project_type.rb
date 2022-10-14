module Types
  class ProjectType < Types::BaseObject
    field :id, ID
    field :name, String
    field :consent_management, Boolean
    field :track_referral, Boolean
    field :description, String
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
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime

    def algorithms_count
      object.algorithms.size
    end
    
    def variables_count
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

    def diagnoses_count
      object.diagnoses.size
    end
  end
end
