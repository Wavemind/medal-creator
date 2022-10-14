module Types
  class InstanceType < Types::BaseObject
    field :id, ID
    field :instanceable_id, Integer
    field :instanceable_type, String
    field :position_x, Integer
    field :position_y, Integer
    field :is_pre_referral, Boolean
    field :description_translations, Types::HstoreType
    field :duration_translations, Types::HstoreType
    field :conditions, [Types::ConditionType]
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
