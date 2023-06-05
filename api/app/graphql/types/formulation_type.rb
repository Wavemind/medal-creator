module Types
  class FormulationType < Types::BaseObject
    field :administration_route, Types::AdministrationRouteType
    field :minimal_dose_per_kg, Float
    field :maximal_dose_per_kg, Float
    field :maximal_dose, Float
    field :medication_form, Types::Enum::MedicationFormEnum, null: false
    field :dose_form, Float
    field :liquid_concentration, Integer
    field :doses_per_day, Integer
    field :unique_dose, Float
    field :breakable, Types::Enum::BreakableEnum
    field :by_age, Boolean
    field :description_translations, Types::HstoreType
    field :injection_instructions_translations, Types::HstoreType
    field :dispensing_description_translations, Types::HstoreType
  end
end
