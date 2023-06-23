module Types
  class DecisionTreeType < Types::BaseObject
    field :reference, Integer, null: false
    field :node, Types::VariableType, null: false
    field :label_translations, Types::HstoreType, null: false
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :cut_off_value_type, String
    field :components, [Types::InstanceType], null: false
    field :diagnoses, [Types::DiagnosisType], null: false
    field :algorithm, Types::AlgorithmType, null: false
    field :available_nodes, [Types::NodeType]

    def available_nodes
      object.available_nodes
    end
  end
end
