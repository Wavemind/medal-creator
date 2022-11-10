module Types
  module Input
    class AdministrationRouteInputType < Types::BaseInputObject
      argument :category, String, required: false
      argument :name_translations, Types::HstoreType, required: false
    end
  end
end
