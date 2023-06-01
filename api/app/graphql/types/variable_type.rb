module Types
  class VariableType < Types::NodeType
    field :type, String, null: false
    field :answers, [Types::AnswerType], null: false
    field :answer_type, Types::AnswerTypeType, null: false
    field :stage, String
    field :system, Types::Enum::SystemEnum
    field :step, String
    field :formula, String
    field :round, Types::Enum::RoundEnum
    field :is_mandatory, Boolean, null: false
    field :is_unavailable, Boolean, null: false
    field :is_estimable, Boolean, null: false
    field :is_identifiable, Boolean, null: false
    field :is_referral, Boolean, null: false
    field :is_pre_fill, Boolean, null: false
    field :is_default, Boolean, null: false
    field :emergency_status, Types::Enum::EmergencyStatusEnum
    field :reference_table_male_name, String
    field :reference_table_female_name, String
    field :min_value_warning, Integer
    field :max_value_warning, Integer
    field :min_value_error, Integer
    field :max_value_error, Integer
    field :min_message_error_translations, Types::HstoreType
    field :max_message_error_translations, Types::HstoreType
    field :min_message_warning_translations, Types::HstoreType
    field :max_message_warning_translations, Types::HstoreType
    field :placeholder_translations, Types::HstoreType
    field :dependencies_by_algorithm, GraphQL::Types::JSON
    field :node_complaint_categories, [Types::NodeComplaintCategoryType]

    def dependencies_by_algorithm
      object.dependencies_by_algorithm.values
    end
  end
end
