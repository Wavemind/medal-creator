class TranslatedFieldsPresenceValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, _value)
    project_id = options[:project].call(record)
    project = Project.find(project_id)

    language = project.language

    return unless record[attribute][language.code].blank?

    record.errors.add(translation_field, I18n.t('errors.messages.hstore_blank', language: language.name))
  end
end
