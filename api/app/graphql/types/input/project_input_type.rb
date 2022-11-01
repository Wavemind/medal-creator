module Types
  module Input
    class ProjectInputType < Types::BaseInputObject
      argument :name, String, required: false
      argument :consent_management, Boolean, required: false
      argument :track_referral, Boolean, required: false
      argument :description, String, required: false
      argument :emergency_content_translations, Types::HstoreType, required: false
      argument :emergency_content_version, Integer, required: false
      argument :medal_r_config, GraphQL::Types::JSON, required: false
      argument :village_json, GraphQL::Types::JSON, required: false
    end
  end
end
