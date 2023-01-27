# Define the different forms for a drug
class Formulation < ApplicationRecord
  enum breakable: %i[one two four]
  enum medication_form: %i[tablet capsule syrup suspension suppository drops solution
                           powder_for_injection patch cream ointment gel spray inhaler
                           pessary dispersible_tablet lotion]

  belongs_to :node, class_name: 'HealthCares::Drug'
  belongs_to :administration_route

  validates_presence_of :medication_form, :doses_per_day
  # Validate presence of fields needed to calculate dosage for tablets, capsules, syrup, solution, powder_for_injection and suspension (unless the condition is based on the age)
  validates_presence_of :minimal_dose_per_kg, :maximal_dose_per_kg, :maximal_dose, :dose_form, if: proc {
                                                                                                     %w[tablet capsule syrup suspension solution powder_for_injection dispersible_tablet].include?(medication_form) && !(by_age == '1' || by_age == true)
                                                                                                   }
  # Validate presence of liquid concentration needed to calculate dosage for syrup, solution, powder_for_injection and suspension (unless the condition is based on the age)
  validates_presence_of :liquid_concentration, if: proc {
                                                     %w[syrup suspension solution powder_for_injection].include?(medication_form) && !(by_age == '1' || by_age == true)
                                                   }
  # Validate presence of the breakable needed to calculate dosage for tablets (unless the condition is based on the age)
  validates_presence_of :breakable, if: proc {
                                          %w[tablet dispersible_tablet].include?(medication_form) && !(by_age == '1' || by_age == true)
                                        }
  # Validate presence of unique dose since the dosage has not to be calculated but only displayed (for the other medication forms)
  validates_presence_of :unique_dose, unless: proc {
                                                %w[tablet capsule syrup suspension solution powder_for_injection dispersible_tablet].include?(medication_form) || (by_age == '1' || by_age == true)
                                              }

  translates :description, :injection_instructions, :dispensing_description

  def validate_dosage_logic
    if minimal_dose_per_kg.present? && minimal_dose_per_kg > maximal_dose_per_kg
      errors.add(:minimal_dose_per_kg,
                 I18n.t('formulations.errors.minimum_higher_than_maximum'))
    end
    return unless maximal_dose_per_kg.present? && maximal_dose_per_kg > maximal_dose

    errors.add(:maximal_dose_per_kg,
               I18n.t('formulations.errors.maximum_per_kg_higher_than_maximum'))
  end
end
