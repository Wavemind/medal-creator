module Types
  class InstanceType < Types::BaseObject
    field :node, Types::NodeType, null: false
    field :node_id, Integer, null: false
    field :category, String, null: false
    field :instanceable_id, Integer, null: false
    field :instanceable_type, String, null: false
    field :diagnosis_id, Integer
    field :position_x, Float, null: false
    field :position_y, Float, null: false
    field :is_pre_referral, Boolean
    field :description_translations, Types::HstoreType
    field :duration_translations, Types::HstoreType
    field :conditions, [Types::ConditionType], null: false
    field :diagram_name, String

    def diagram_name
      object.instanceable.reference_label
    end

    def category
      object.node.type.split('::').last
    end
  end
end
