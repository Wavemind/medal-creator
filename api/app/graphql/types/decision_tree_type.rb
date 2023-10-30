module Types
  class DecisionTreeType < Types::BaseObject
    field :full_reference, String, null: false
    field :node, Types::VariableType, null: false
    field :label_translations, Types::HstoreType, null: false
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :cut_off_value_type, String
    field :diagnoses, [Types::DiagnosisType], null: false
    field :algorithm, Types::AlgorithmType, null: false
  end
end
