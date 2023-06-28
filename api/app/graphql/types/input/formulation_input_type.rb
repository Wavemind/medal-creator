module Types
  module Input
    class FormulationInputType < Types::BaseInputObject
      argument :administration_route_id, ID, required: false
      argument :minimal_dose_per_kg, Float, required: false
      argument :maximal_dose_per_kg, Float, required: false
      argument :maximal_dose, Float, required: false
      argument :medication_form, Types::Enum::MedicationFormEnum, required: true
      argument :dose_form, Float, required: false
      argument :liquid_concentration, Integer, required: false
      argument :doses_per_day, Integer, required: false
      argument :unique_dose, Float, required: false
      argument :breakable, String, required: false
      argument :by_age, Boolean, required: false
      argument :description_translations, Types::Input::HstoreInputType, required: false
      argument :injection_instructions_translations, Types::Input::HstoreInputType, required: false
      argument :dispensing_description_translations, Types::Input::HstoreInputType, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
