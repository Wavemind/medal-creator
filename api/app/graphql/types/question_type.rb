module Types
  class QuestionType < Types::BaseObject
    field :id, ID, null: true
    field :reference, Integer, null: true
    field :label_translations, Types::HstoreType, null: true
    field :description_translations, Types::HstoreType, null: true
    field :is_neonat, Boolean, null: true
    field :is_danger_sign, Boolean, null: true
    field :answers, [Types::AnswerType], null: true
    field :instances, [Types::InstanceType], null: true
    field :answer_type, Types::AnswerTypeType, null: true
    field :stage, String, null: true
    field :system, String, null: true
    field :step, String, null: true
    field :formula, String, null: true
    field :round, Integer, null: true
    field :is_mandatory, Boolean, null: true
    field :is_unavailable, Boolean, null: true
    field :is_estimable, Boolean, null: true
    field :is_identifiable, Boolean, null: true
    field :is_referral, Boolean, null: true
    field :is_pre_fill, Boolean, null: true
    field :is_default, Boolean, null: true
    field :emergency_status, Integer, null: true
    field :reference_table_male_name, String, null: true
    field :reference_table_female_name, String, null: true
    field :min_value_warning, Integer, null: true
    field :max_value_warning, Integer, null: true
    field :min_value_error, Integer, null: true
    field :max_value_error, Integer, null: true
    field :min_message_error_translations, Types::HstoreType, null: true
    field :max_message_error_translations, Types::HstoreType, null: true
    field :min_message_warning_translations, Types::HstoreType, null: true
    field :max_message_warning_translations, Types::HstoreType, null: true
    field :placeholder_translations, Types::HstoreType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
