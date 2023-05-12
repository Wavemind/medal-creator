class TranslatedFieldsPresenceValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, _value)
    project_id = options[:project].call(record)
    project = Project.find(project_id)

    language = project.language

    record.errors.add(attribute, I18n.t('errors.messages.hstore_blank', language: language.name)) if record.send(attribute).nil? || record[attribute][language.code].blank?
  end
end
