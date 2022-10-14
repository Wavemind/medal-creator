module Types
  class InstanceType < Types::BaseObject
    field :id, ID, null: false
    field :instanceable_id, Integer, null: false
    field :instanceable_type, String, null: false
    field :position_x, Integer, null: false
    field :position_y, Integer, null: false
    field :is_pre_referral, Boolean, null: false
    field :description_translations, Types::HstoreType, null: true
    field :duration_translations, Types::HstoreType, null: true
    field :conditions, [Types::ConditionType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
