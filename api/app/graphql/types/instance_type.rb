module Types
  class InstanceType < Types::BaseObject
    field :node, Types::NodeType, null: false
    field :node_id, ID, null: false
    field :category, String, null: false
    field :instanceable_id, ID, null: false
    field :instanceable_type, String, null: false
    field :diagnosis_id, ID
    field :position_x, Float, null: false
    field :position_y, Float, null: false
    field :is_pre_referral, Boolean
    field :description_translations, Types::HstoreType
    field :duration_translations, Types::HstoreType
    field :conditions, [Types::ConditionType], null: false
    field :diagram_name, String
    field :min_score, Integer, null: true

    def diagram_name
      object.instanceable.reference_label
    end

    def category
      object.node.type.split('::').last
    end

    def min_score
      object.node.is_a?(QuestionsSequence) ? object.node.min_score : nil
    end
  end
end
