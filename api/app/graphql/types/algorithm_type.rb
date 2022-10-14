module Types
  class AlgorithmType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: true
    field :minimum_age, Integer, null: true
    field :age_limit, Integer, null: true
    field :age_limit_message_translations, Types::HstoreType, null: true
    field :description_translations, Types::HstoreType, null: true
    field :mode, String, null: true
    field :status, String, null: true
    field :full_order_json, GraphQL::Types::JSON, null: true
    field :medal_r_json, GraphQL::Types::JSON, null: true
    field :medal_r_json_version, Integer, null: true
    field :job_id, String, null: true
    field :medal_data_config_variables, [Types::MedalDataConfigVariableType], null: true
    field :decision_trees, [Types::DecisionTreeType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
