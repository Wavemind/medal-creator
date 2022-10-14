module Types
  class ProjectType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :consent_management, Boolean, null: false
    field :track_referral, Boolean, null: false
    field :description, String, null: false
    field :emergency_content_translations, Types::HstoreType, null: false
    field :emergency_content_version, Integer, null: false
    field :medal_r_config, GraphQL::Types::JSON, null: false
    field :village_json, GraphQL::Types::JSON, null: false
    field :algorithms, [Types::AlgorithmType], null: false
    field :algorithms_count, Integer, null: false
    field :questions, [Types::QuestionType], null: false
    field :questions_count, Integer, null: false
    field :drugs, [Types::DrugType], null: false
    field :drugs_count, Integer, null: false
    field :managements, [Types::ManagementType], null: false
    field :managements_count, Integer, null: false
    field :questions_sequences, [Types::QuestionsSequenceType], null: false
    field :questions_sequences_count, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

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
