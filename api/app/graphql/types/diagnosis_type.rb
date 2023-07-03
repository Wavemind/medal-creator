module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer
    field :components, [Types::InstanceType], null: false
  end
end
