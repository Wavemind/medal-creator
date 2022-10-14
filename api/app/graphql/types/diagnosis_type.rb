module Types
  class DiagnosisType < Types::BaseObject
    field :id, ID, null: true
    field :reference, Integer, null: true
    field :label_translations, Types::HstoreType, null: true
    field :description_translations, Types::HstoreType, null: true
    field :is_neonat, Boolean, null: true
    field :is_danger_sign, Boolean, null: true
    field :level_of_urgency, Integer, null: true
    field :instances, [Types::InstanceType], null: true
    field :components, [Types::InstanceType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
