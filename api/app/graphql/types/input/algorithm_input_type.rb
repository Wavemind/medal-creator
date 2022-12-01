module Types
  module Input
    class AlgorithmInputType < Types::BaseInputObject
      argument :project_id, ID, required: false
      argument :name, String, required: false
      argument :minimum_age, Integer, required: false
      argument :age_limit, Integer, required: false
      argument :age_limit_message_translations, Types::Input::HstoreInputType, required: false
      argument :description_translations, Types::Input::HstoreInputType, required: false
      argument :mode, Integer, required: false
      argument :status, String, required: false
      argument :full_order_json, GraphQL::Types::JSON, required: false
      argument :medal_r_json, GraphQL::Types::JSON, required: false
      argument :medal_r_json_version, Integer, required: false
      argument :job_id, String, required: false
      argument :algorithm_languages_attributes, [Types::Input::AlgorithmLanguageInputType], required: false
    end
  end
end
