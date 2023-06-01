module Types
  module Input
    class AlgorithmInputType < Types::BaseInputObject
      argument :project_id, ID, required: false
      argument :name, String, required: false
      argument :minimum_age, Integer, required: false
      argument :age_limit, Integer, required: false
      argument :age_limit_message_translations, Types::Input::HstoreInputType, required: false
      argument :description_translations, Types::Input::HstoreInputType, required: false
      argument :mode, String, required: false
      argument :status, String, required: false
      argument :full_order_json, GraphQL::Types::JSON, required: false
      argument :language_ids, [ID], required: false
    end
  end
end
