module Types
  class ProjectType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :algorithms, [Types::AlgorithmType], null: false
    field :algorithms_count, Integer, null: false
    field :variables_count, Integer, null: false
    field :drugs_count, Integer, null: false
    field :managements_count, Integer, null: false
    field :medical_conditions_count, Integer, null: false
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
