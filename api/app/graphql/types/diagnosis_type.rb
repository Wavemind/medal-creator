module Types
  class DiagnosisType < Types::NodeType
    field :label_translations, Types::HstoreType
    field :description_translations, Types::HstoreType
    field :level_of_urgency, Integer
    field :components, [Types::InstanceType]
  end
end
