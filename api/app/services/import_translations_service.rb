class ImportTranslationsService

  def self.process(file)
    ActiveRecord::Base.transaction(requires_new: true) do
      begin
        xl_file = Roo::Spreadsheet.open(file.path, extension: :xlsx)

        update_specific_translations(xl_file.sheet(0))
        update_generic_translations(DecisionTree, get_translatable_params(xl_file.sheet(1), DecisionTree.translatable_params), xl_file.sheet(1))
        update_generic_translations(Diagnosis, get_translatable_params(xl_file.sheet(2), Node.translatable_params), xl_file.sheet(2))
        update_generic_translations(Variable, get_translatable_params(xl_file.sheet(3), Variable.translatable_params), xl_file.sheet(3))
        update_generic_translations(Answer, get_translatable_params(xl_file.sheet(3), Answer.translatable_params), xl_file.sheet(3))
        update_generic_translations(HealthCares::Drug, get_translatable_params(xl_file.sheet(4), Node.translatable_params), xl_file.sheet(4))
        update_generic_translations(Formulation, get_translatable_params(xl_file.sheet(4), Formulation.translatable_params), xl_file.sheet(4))
        update_generic_translations(Instance, get_translatable_params(xl_file.sheet(5), Instance.translatable_params), xl_file.sheet(5))
        update_generic_translations(HealthCares::Management, get_translatable_params(xl_file.sheet(6), Node.translatable_params), xl_file.sheet(6))
        update_generic_translations(QuestionsSequence, get_translatable_params(xl_file.sheet(7), Node.translatable_params), xl_file.sheet(7))
      rescue => e
        puts e
        puts e.backtrace
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.import_xl_fail')
      end
    end
  end

  # Generic method to update translations for a given model with a given ID from excel sheet
  def self.update_generic_translations(model, params, data)
    data.each_with_index do |row, index|
      if index != 0 && row[1] == model.to_s
        object = model.find(row[0])
        unless object.nil?
          object_params = {}
          params.map do |field, col|
            object_params[field] = row[col]
          end

          object.update!(object_params)
        end
      end
    end
  end

  # Update specific translations from General excel sheet
  def self.update_specific_translations(data)
    languages = []
    data.each_with_index do |row, index|
      if index == 0
        row.each_with_index do |head, i|
          unless i < 3
            languages.push(head)
          end
        end
      else
        model = Object.const_get(row[1])
        object = model.find(row[0])
        field_to_update = "#{row[2].parameterize.underscore}_translations"
        translations = {}
        languages.each_with_index do |language, i|
          translations[language] = row[3+i]
        end
        params = {}
        params[field_to_update] = translations
        object.update!(params)
      end
    end
  end

  # Build translatable params from model translatable fields
  def self.get_translatable_params(data, model_params)
    fields_to_update = {}

    data.row(1).each_with_index do |head, index|
      code = head[/\((.*?)\)/m, 1]
      model_params.each do |param|
        if head.include?(param.capitalize.tr('_', ' '))
          fields_to_update["#{param}_#{code}"] = index
        end
      end
    end

    fields_to_update
  end
end