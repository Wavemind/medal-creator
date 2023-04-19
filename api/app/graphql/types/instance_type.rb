module Types
  class InstanceType < Types::BaseObject
    field :instanceable_id, Integer
    field :instanceable_type, String
    field :position_x, Integer
    field :position_y, Integer
    field :is_pre_referral, Boolean
    field :description_translations, Types::HstoreType
    field :duration_translations, Types::HstoreType
    field :conditions, [Types::ConditionType]
    field :diagram_name, String

    def diagram_name
      object.instanceable.reference_label
    end
  end
end
