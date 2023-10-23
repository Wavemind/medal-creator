module Types
  class AlgorithmType < Types::BaseObject
    field :name, String, null: false
    field :minimum_age, Integer, null: false
    field :age_limit, Integer, null: false
    field :age_limit_message_translations, Types::HstoreType, null: false
    field :description_translations, Types::HstoreType, null: false
    field :mode, String
    field :status, String, null: false
    field :full_order_json, GraphQL::Types::JSON
    field :medal_r_json, GraphQL::Types::JSON
    field :medal_r_json_version, Integer
    field :job_id, String
    field :medal_data_config_variables, [Types::MedalDataConfigVariableType], null: false
    field :decision_trees, [Types::DecisionTreeType], null: false
    field :languages, [Types::LanguageType], null: false
    field :components, [Types::InstanceType]
    field :used_variables, [Integer], null: false
    field :formatted_consultation_order, GraphQL::Types::JSON

    def formatted_consultation_order
      object.build_consultation_order
    end

    def used_variables
      object.extract_used_nodes.map(&:id)
    end

    def sorted_medal_data_variables
      medal_data_config_variables.sort(created_at: :desc)
    end
  end
end
