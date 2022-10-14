module Types
  class QuestionType < Types::BaseObject
    field :id, ID, null: false
    field :reference, Integer, null: false
    field :label, Types::HstoreType, null: true
    field :description, Types::HstoreType, null: true
    field :is_neonat, Boolean, null: false
    field :is_danger_sign, Boolean, null: false
    field :answers, [Types::AnswerType], null: true
    field :instances, [Types::InstanceType], null: true
    field :answer_type, Types::AnswerTypeType, null: true
    field :stage, String, null: false
    field :system, String, null: false
    field :step, String, null: false
    field :formula, String, null: false
    field :round, Integer, null: false
    field :is_mandatory, Boolean, null: false
    field :is_unavailable, Boolean, null: false
    field :is_estimable, Boolean, null: false
    field :is_identifiable, Boolean, null: false
    field :is_referral, Boolean, null: false
    field :is_pre_fill, Boolean, null: false
    field :is_default, Boolean, null: false
    field :emergency_status, Integer, null: false
    field :reference_table_male_name, String, null: false
    field :reference_table_female_name, String, null: false
    field :min_value_warning, Integer, null: false
    field :max_value_warning, Integer, null: false
    field :min_value_error, Integer, null: false
    field :max_value_error, Integer, null: false
    field :min_message_error_translations, Types::HstoreType, null: false
    field :max_message_error_translations, Types::HstoreType, null: false
    field :min_message_warning_translations, Types::HstoreType, null: false
    field :max_message_warning_translations, Types::HstoreType, null: false
    field :placeholder_translations, Types::HstoreType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
