module Types
  class DecisionTreeType < Types::BaseObject
    field :id, ID
    field :reference, Integer
    field :node, Types::QuestionType
    field :label_translations, Types::HstoreType
    field :cut_off_start, Integer
    field :cut_off_end, Integer
    field :diagnoses, [Types::DiagnosisType]
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
