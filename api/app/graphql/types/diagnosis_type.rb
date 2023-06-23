module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer
    field :components, [Types::InstanceType], null: false
    field :available_nodes, [Types::NodeType]

    def available_nodes
      object.available_nodes
    end
  end
end
