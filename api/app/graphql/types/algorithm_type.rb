module Types
  class AlgorithmType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :minimum_age, Integer, null: false
    field :age_limit, Integer, null: false
    field :age_limit_message, Types::HstoreType, null: false
    field :description, Types::HstoreType, null: true
    field :mode, String, null: false
    field :status, String, null: false
    field :full_order_json, GraphQL::Types::JSON, null: true
    field :medal_r_json, GraphQL::Types::JSON, null: true
    field :medal_r_json_version, Integer, null: false
    field :job_id, String, null: false
    field :medal_data_config_variables, [Types::MedalDataConfigVariableType], null: true
    field :decision_trees, [Types::DecisionTreeType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
