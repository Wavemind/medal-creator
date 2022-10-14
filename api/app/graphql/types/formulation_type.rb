module Types
  class FormulationType < Types::BaseObject
    field :id, ID, null: false
    field :administration_route, Types::AdministrationRouteType, null: false
    field :minimal_dose_per_kg, Float, null: false
    field :maximal_dose_per_kg, Float, null: false
    field :maximal_dose, Float, null: false
    field :medication_form, Integer, null: false
    field :dose_form, Float, null: false
    field :liquid_concentration, Integer, null: false
    field :doses_per_day, Integer, null: false
    field :unique_dose, Float, null: false
    field :breakable, String, null: false
    field :by_age, Boolean, null: false
    field :description_translations, Types::HstoreType, null: false
    field :injection_instructions_translations, Types::HstoreType, null: false
    field :dispensing_description_translations, Types::HstoreType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
