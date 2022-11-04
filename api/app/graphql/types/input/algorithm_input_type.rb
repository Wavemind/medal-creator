module Types
  module Input
    class AlgorithmInputType < Types::BaseInputObject
      argument :name, String, required: false
      argument :minimum_age, Integer, required: false
      argument :age_limit, Integer, required: false
      argument :age_limit_message_translations, Types::HstoreType, required: false
      argument :description_translations, Types::HstoreType, required: false
      argument :mode, String, required: false
      argument :status, String, required: false
      argument :full_order_json, GraphQL::Types::JSON, required: false
      argument :medal_r_json, GraphQL::Types::JSON, required: false
      argument :medal_r_json_version, Integer, required: false
      argument :job_id, String, required: false
    end
  end
end
