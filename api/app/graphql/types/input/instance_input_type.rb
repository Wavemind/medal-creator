module Types
  module Input
    class InstanceInputType < Types::BaseInputObject
      argument :instanceable_id, Integer, required: false
      argument :instanceable_type, String, required: false
      argument :position_x, Integer, required: false
      argument :position_y, Integer, required: false
      argument :is_pre_referral, Boolean, required: false
      argument :description_translations, Types::HstoreType, required: false
      argument :duration_translations, Types::HstoreType, required: false
    end
  end
end
