class VariableValidator < ActiveModel::Validator
  FORCED_BOOLEAN_TYPES = %w[Variables::ComplaintCategory Variables::Vaccine]
  FORCED_FLOAT_TYPES = %w[Variables::BasicMeasurement Variables::VitalSignAnthropometric]
  FORCED_INTEGER_TYPES = %w[Variables::BackgroundCalculation]
  SYSTEM_INCLUDING_TYPES = %w[Variables::ChronicCondition Variables::Exposure Variables::ObservedPhysicalSign
                              Variables::PhysicalExam Variables::Symptom Variables::Vaccine Variables::VitalSignAnthropometric]
  ESTIMABLE_TYPES = %w[Variables::BasicMeasurement]
  WITHOUT_ANSWERS_TYPES = %w[Variables::BasicMeasurement Variables::VitalSignAnthropometric]
  WITHOUT_CONDITIONING_CC_TYPES = %w[Variables::ComplaintCategory]

  def validate(record)
    return if record.is_default
    if FORCED_BOOLEAN_TYPES.include?(record.type) && record.answer_type.value != 'Boolean'
      record.errors.add(:answer_type,
                        I18n.t('activerecord.errors.variables.forced_boolean'))
    end
    if FORCED_FLOAT_TYPES.include?(record.type) && record.answer_type.value != 'Float'
      record.errors.add(:answer_type,
                        I18n.t('activerecord.errors.variables.forced_float'))
    end
    if FORCED_INTEGER_TYPES.include?(record.type) && record.answer_type.value != 'Integer' && record.answer_type.display != 'Formula'
      record.errors.add(:answer_type,
                        I18n.t('activerecord.errors.variables.forced_integer'))
    end
    if SYSTEM_INCLUDING_TYPES.include?(record.type) && record.system.nil?
      record.errors.add(:system,
                        I18n.t('activerecord.errors.variables.should_have_system'))
    end
    if SYSTEM_INCLUDING_TYPES.exclude?(record.type) && record.type != 'Variables::BackgroundCalculation' && record.system.present?
      record.errors.add(:system,
                        I18n.t('activerecord.errors.variables.should_not_have_system'))
    end
    if ESTIMABLE_TYPES.exclude?(record.type) && record.is_estimable
      record.errors.add(:is_estimable,
                        I18n.t('activerecord.errors.variables.can_not_be_estimable'))
    end
    if WITHOUT_ANSWERS_TYPES.include?(record.type) && record.answers.any? && !record.is_unavailable
      record.errors.add(:base,
                        I18n.t('activerecord.errors.variables.should_not_have_answers'))
    end
    return unless WITHOUT_ANSWERS_TYPES.include?(record.type) && record.node_complaint_categories.any?

    record.errors.add(:base,
                      I18n.t('activerecord.errors.variables.should_not_have_cc'))
  end
end
