module Types
  class ProjectType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: true
    field :consent_management, Boolean, null: true
    field :track_referral, Boolean, null: true
    field :description, String, null: true
    field :emergency_content_translations, Types::HstoreType, null: true
    field :emergency_content_version, Integer, null: true
    field :medal_r_config, GraphQL::Types::JSON, null: true
    field :village_json, GraphQL::Types::JSON, null: true
    field :algorithms, [Types::AlgorithmType], null: true
    field :algorithms_count, Integer, null: true
    field :questions, [Types::QuestionType], null: true
    field :questions_count, Integer, null: true
    field :drugs, [Types::DrugType], null: true
    field :drugs_count, Integer, null: true
    field :managements, [Types::ManagementType], null: true
    field :managements_count, Integer, null: true
    field :questions_sequences, [Types::QuestionsSequenceType], null: true
    field :questions_sequences_count, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true

    def algorithms_count
      object.algorithms.size
    end
    
    def variables_count
      object.nodes.questions.size
    end

    def drugs_count
      object.nodes.drugs.size
    end

    def managements_count
      object.nodes.managements.size
    end

    def medical_conditions_count
      object.nodes.diagnoses.size
    end
  end
end
