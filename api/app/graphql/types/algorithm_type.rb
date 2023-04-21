module Types
  class AlgorithmType < Types::BaseObject
    field :name, String
    field :minimum_age, Integer
    field :age_limit, Integer
    field :age_limit_message_translations, Types::HstoreType
    field :description_translations, Types::HstoreType
    field :mode, String
    field :status, String
    field :full_order_json, GraphQL::Types::JSON
    field :medal_r_json, GraphQL::Types::JSON
    field :medal_r_json_version, Integer
    field :job_id, String
    field :medal_data_config_variables, [Types::MedalDataConfigVariableType]
    field :decision_trees, [Types::DecisionTreeType]
    field :languages, [Types::LanguageType]
    field :used_variables, [Integer]
    field :formatted_consultation_order

    def formatted_consultation_order
      object.build_consultation_order
    end
    def used_variables
      object.extract_used_nodes.map(&:id)
    end
  end
end
