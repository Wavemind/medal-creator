module Types
  module Input
    class QuestionInputType < Types::NodeInputType
      argument :answers, [Types::AnswerType], required: false
      argument :answer_type, Types::AnswerTypeType, required: false
      argument :stage, String, required: false
      argument :system, String, required: false
      argument :step, String, required: false
      argument :formula, String, required: false
      argument :round, String, required: false
      argument :is_mandatory, Boolean, required: false
      argument :is_unavailable, Boolean, required: false
      argument :is_estimable, Boolean, required: false
      argument :is_identifiable, Boolean, required: false
      argument :is_referral, Boolean, required: false
      argument :is_pre_fill, Boolean, required: false
      argument :is_default, Boolean, required: false
      argument :emergency_status, Integer, required: false
      argument :reference_table_male_name, String, required: false
      argument :reference_table_female_name, String, required: false
      argument :min_value_warning, Integer, required: false
      argument :max_value_warning, Integer, required: false
      argument :min_value_error, Integer, required: false
      argument :max_value_error, Integer, required: false
      argument :min_message_error_translations, Types::HstoreType, required: false
      argument :max_message_error_translations, Types::HstoreType, required: false
      argument :min_message_warning_translations, Types::HstoreType, required: false
      argument :max_message_warning_translations, Types::HstoreType, required: false
      argument :placeholder_translations, Types::HstoreType, required: false
    end
  end
end
