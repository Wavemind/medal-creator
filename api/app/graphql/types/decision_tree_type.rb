module Types
  class DecisionTreeType < Types::BaseObject
    field :id, ID, null: true
    field :reference, Integer, null: true
    field :node, Types::QuestionType, null: true
    field :label_translations, Types::HstoreType, null: true
    field :cut_off_start, Integer, null: true
    field :cut_off_end, Integer, null: true
    field :diagnoses, [Types::DiagnosisType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
