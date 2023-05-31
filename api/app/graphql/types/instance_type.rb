module Types
  class InstanceType < Types::BaseObject
    field :instanceable_id, Integer, null: false
    field :instanceable_type, String, null: false
    field :diagnosis_id, Integer
    field :position_x, Integer, null: false
    field :position_y, Integer, null: false
    field :is_pre_referral, Boolean
    field :description_translations, Types::HstoreType
    field :duration_translations, Types::HstoreType
    field :conditions, [Types::ConditionType], null: false
    field :diagram_name, String

    def diagram_name
      object.instanceable.reference_label
    end
  end
end
