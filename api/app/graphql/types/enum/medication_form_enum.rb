module Types
  module Enum
    class MedicationFormEnum < Types::BaseEnum
      Formulation.medication_forms.keys.each do |option|
        value option.downcase, value: option
      end
    end
  end
end
