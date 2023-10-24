module Types
  module Input
    class AlgorithmInputType < Types::BaseInputObject
      argument :project_id, ID, required: false
      argument :name, String
      argument :minimum_age, Integer, required: false
      argument :age_limit, Integer, required: false
      argument :age_limit_message_translations, Types::Input::HstoreInputType, required: false
      argument :description_translations, Types::Input::HstoreInputType, required: false
      argument :mode, String, required: false
      argument :full_order_json, GraphQL::Types::JSON, required: false
      argument :language_ids, [ID], required: false
      argument :medal_data_config_variables_attributes, [Types::Input::MedalDataConfigVariableInputType], required: false
    end
  end
end
