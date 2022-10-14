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
    field :last_updated_decision_trees, [Types::DecisionTreeType], null: false
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

    # Check if lastUpdated or lastOpened
    def last_updated_decision_trees
      object.algorithms.map(&:decision_trees).flatten.sort { |a, b| b.updated_at <=> a.updated_at }.first(10)
    end
  end
end
