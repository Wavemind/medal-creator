module Types
  class DecisionTreeType < Types::BaseObject
    field :id, ID, null: false
    field :reference, Integer, null: false
    field :node, Types::QuestionType, null: false
    field :label, Types::HstoreType, null: true
    field :cut_off_start, Integer, null: false
    field :cut_off_end, Integer, null: false
    field :diagnoses, [Types::DiagnosisType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
