module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer, null: false
    field :components, [Types::InstanceType], null: false
  end
end
