module Types
  class VariableType < Types::NodeType
    field :answers, [Types::AnswerType]
    field :answer_type, Types::AnswerTypeType
    field :stage, String
    field :system, Types::Enum::SystemEnum
    field :step, String
    field :formula, String
    field :round, Types::Enum::RoundEnum
    field :is_mandatory, Boolean
    field :is_unavailable, Boolean
    field :is_estimable, Boolean
    field :is_identifiable, Boolean
    field :is_referral, Boolean
    field :is_pre_fill, Boolean
    field :is_default, Boolean
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

    def dependencies_by_algorithm
      object.dependencies_by_algorithm.values
    end
  end
end
