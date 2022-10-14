module Types
  class FormulationType < Types::BaseObject
    field :id, ID, null: true
    field :administration_route, Types::AdministrationRouteType, null: true
    field :minimal_dose_per_kg, Float, null: true
    field :maximal_dose_per_kg, Float, null: true
    field :maximal_dose, Float, null: true
    field :medication_form, Integer, null: true
    field :dose_form, Float, null: true
    field :liquid_concentration, Integer, null: true
    field :doses_per_day, Integer, null: true
    field :unique_dose, Float, null: true
    field :breakable, String, null: true
    field :by_age, Boolean, null: true
    field :description_translations, Types::HstoreType, null: true
    field :injection_instructions_translations, Types::HstoreType, null: true
    field :dispensing_description_translations, Types::HstoreType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
