module Types
  module Input
    class VariableInputType < Types::Input::NodeInputType
      argument :complaint_category_ids, [ID], required: false
      argument :answer_type_id, ID, required: true
      argument :type, Types::Enum::VariableCategoryEnum, required: true
      argument :system, Types::Enum::SystemEnum, required: false
      argument :formula, String, required: false
      argument :round, Types::Enum::RoundEnum, required: false
      argument :is_mandatory, Boolean, required: false
      argument :is_unavailable, Boolean, required: false
      argument :is_estimable, Boolean, required: false
      argument :is_identifiable, Boolean, required: false
      argument :is_pre_fill, Boolean, required: false
      argument :is_danger_sign, Boolean, required: false
      argument :emergency_status, Types::Enum::EmergencyStatusEnum, required: false
      argument :min_value_warning, Integer, required: false
      argument :max_value_warning, Integer, required: false
      argument :min_value_error, Integer, required: false
      argument :max_value_error, Integer, required: false
      argument :min_message_error_translations, Types::Input::HstoreInputType, required: false
      argument :max_message_error_translations, Types::Input::HstoreInputType, required: false
      argument :min_message_warning_translations, Types::Input::HstoreInputType, required: false
      argument :max_message_warning_translations, Types::Input::HstoreInputType, required: false
      argument :placeholder_translations, Types::Input::HstoreInputType, required: false
      argument :answers_attributes, [Types::Input::AnswerInputType], required: true
    end
  end
end
