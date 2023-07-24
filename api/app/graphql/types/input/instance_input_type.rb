module Types
  module Input
    class InstanceInputType < Types::BaseInputObject
      argument :node_id, ID, required: false
      argument :instanceable_id, ID, required: false
      argument :instanceable_type, String, required: false
      argument :position_x, Float, required: false
      argument :position_y, Float, required: false
      argument :is_pre_referral, Boolean, required: false
      argument :description_translations, Types::Input::HstoreInputType, required: false
      argument :duration_translations, Types::Input::HstoreInputType, required: false
    end
  end
end
