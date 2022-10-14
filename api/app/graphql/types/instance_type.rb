module Types
  class InstanceType < Types::BaseObject
    field :id, ID, null: true
    field :instanceable_id, Integer, null: true
    field :instanceable_type, String, null: true
    field :position_x, Integer, null: true
    field :position_y, Integer, null: true
    field :is_pre_referral, Boolean, null: true
    field :description_translations, Types::HstoreType, null: true
    field :duration_translations, Types::HstoreType, null: true
    field :conditions, [Types::ConditionType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
