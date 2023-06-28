module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer, null: false
    field :components, [Types::InstanceType], null: false
    field :excluding_nodes, [Types::DiagnosisType]
    field :excluded_nodes, [Types::DiagnosisType]
  end
end
