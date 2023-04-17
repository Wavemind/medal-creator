module Types
  class VariableType < Types::NodeType
    field :answers, [Types::AnswerType]
    field :answer_type, Types::AnswerTypeType
    field :stage, String
    field :system, String
    field :step, String
    field :formula, String
    field :round, String
    field :is_mandatory, Boolean
    field :is_unavailable, Boolean
    field :is_estimable, Boolean
    field :is_identifiable, Boolean
    field :is_referral, Boolean
    field :is_pre_fill, Boolean
    field :is_default, Boolean
    field :emergency_status, Integer
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
    field :dependencies, [String]

    def dependencies
      object.decision_trees.map(&:reference_label) + object.dependencies.map(&:instanceable).flatten.map(&:reference_label)
    end
  end
end
