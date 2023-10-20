# Define the different forms for a drug
class Formulation < ApplicationRecord
  enum breakable: %i[one two four]
  enum medication_form: %i[tablet capsule syrup suspension suppository drops solution
                           powder_for_injection patch cream ointment gel spray inhaler
                           pessary dispersible_tablet lotion]

  TABLET_FORMS = %w[tablet dispersible_tablet]
  PILL_FORMS = TABLET_FORMS + ['capsule']
  LIQUID_FORMS = %w[syrup suspension solution powder_for_injection]
  CALCULATED_FORMS = PILL_FORMS + LIQUID_FORMS
  NON_CALCULATED_FORMS = %w[suppository drops patch cream ointment gel spray inhaler pessary lotion]

  belongs_to :node, class_name: 'HealthCares::Drug'
  belongs_to :administration_route

  validates_presence_of :medication_form, :doses_per_day
  # Validate presence of fields needed to calculate dosage for tablets, capsules, syrup, solution, powder_for_injection and suspension (unless the condition is based on the age)
  validates_presence_of :minimal_dose_per_kg, :maximal_dose_per_kg, :maximal_dose, :dose_form, if: proc { CALCULATED_FORMS.include?(medication_form) && !by_age }
  # Validate presence of liquid concentration needed to calculate dosage for syrup, solution, powder_for_injection and suspension (unless the condition is based on the age)
  validates_presence_of :liquid_concentration, if: proc { LIQUID_FORMS.include?(medication_form) && !by_age }
  # Validate presence of the breakable needed to calculate dosage for tablets (unless the condition is based on the age)
  validates_presence_of :breakable, if: proc { TABLET_FORMS.include?(medication_form) && !by_age }
  # Validate presence of unique dose since the dosage has not to be calculated but only displayed (for the other medication forms)
  validates_presence_of :unique_dose, if: proc { NON_CALCULATED_FORMS.include?(medication_form) && !by_age }

  after_validation :validate_dosage_logic, if: Proc.new { CALCULATED_FORMS.include?(self.medication_form) && !by_age}

  translates :description, :injection_instructions, :dispensing_description

  # Get translatable attributes
  def self.translatable_params
    %w[injection_instructions dispensing_description description]
  end

  def validate_dosage_logic
    if minimal_dose_per_kg.present? && minimal_dose_per_kg > maximal_dose_per_kg
      errors.add(:minimal_dose_per_kg, I18n.t('activerecord.errors.formulations.minimum_higher_than_maximum'))
    end

    return unless maximal_dose_per_kg.present? && maximal_dose_per_kg > maximal_dose

    errors.add(:maximal_dose_per_kg, I18n.t('activerecord.errors.formulations.maximum_per_kg_higher_than_maximum'))
  end
end
