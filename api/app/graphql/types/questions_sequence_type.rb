module Types
  class QuestionsSequenceType < Types::BaseObject
    field :id, ID, null: true
    field :reference, Integer, null: true
    field :label_translations, Types::HstoreType, null: true
    field :description_translations, Types::HstoreType, null: true
    field :is_neonat, Boolean, null: true
    field :is_danger_sign, Boolean, null: true
    field :min_score, Integer, null: true
    field :cut_off_start, Integer, null: true
    field :cut_off_end, Integer, null: true
    field :answers, [Types::AnswerType], null: true
    field :instances, [Types::InstanceType], null: true
    field :components, [Types::InstanceType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
