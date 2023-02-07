module Types
  class DiagnosisType < Types::NodeType
    field :level_of_urgency, Integer
    field :components, [Types::InstanceType]
    field :description_translations, Types::HstoreType
  end
end
