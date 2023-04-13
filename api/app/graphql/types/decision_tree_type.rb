module Types
  class DecisionTreeType < Types::BaseObject
    field :reference, Integer
    field :node, Types::VariableType
    field :label_translations, Types::HstoreType
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :cut_off_value_type, String
    field :components, [Types::InstanceType]
    field :diagnoses, [Types::DiagnosisType]
    field :algorithm, Types::AlgorithmType
  end
end
