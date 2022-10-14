module Types
  class QuestionsSequenceType < Types::BaseObject
    field :id, ID, null: false
    field :reference, Integer, null: false
    field :label, Types::HstoreType, null: true
    field :description, Types::HstoreType, null: true
    field :is_neonat, Boolean, null: false
    field :is_danger_sign, Boolean, null: false
    field :min_score, Integer, null: false
    field :cut_off_start, Integer, null: false
    field :cut_off_end, Integer, null: false
    field :answers, [Types::AnswerType], null: true
    field :instances, [Types::InstanceType], null: true
    field :components, [Types::InstanceType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
