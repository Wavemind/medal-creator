module Types
  module Input
    class ProjectInputType < Types::BaseInputObject
      argument :name, String, required: true
      argument :language_id, ID, required: true
      argument :consent_management, Boolean, required: false
      argument :track_referral, Boolean, required: false
      argument :description, String, required: false
      argument :study_description_translations, Types::Input::HstoreInputType, required: false
      argument :emergency_content_translations, Types::Input::HstoreInputType, required: false
      argument :emergency_content_version, Integer, required: false
      argument :user_projects_attributes, [Types::Input::UserProjectInputType], required: true
    end
  end
end
