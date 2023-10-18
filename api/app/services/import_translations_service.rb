class ImportTranslationsService

  def process

    file = params[:version][:file]
    if file.present? && File.extname(file.original_filename).include?('xls')
      xl_file = Roo::Spreadsheet.open(file.path, extension: :xlsx)

      update_specific_translations(xl_file.sheet(0))
      update_generic_translations(Diagnosis, Diagnosis.get_translatable_params(xl_file.sheet(1)), xl_file.sheet(1))
      update_generic_translations(FinalDiagnosis, Node.get_translatable_params(xl_file.sheet(2)), xl_file.sheet(2))
      update_generic_translations(Question, Question.get_translatable_params(xl_file.sheet(3)), xl_file.sheet(3))
      update_generic_translations(Answer, Answer.get_translatable_params(xl_file.sheet(3)), xl_file.sheet(3))
      update_generic_translations(HealthCares::Drug, Node.get_translatable_params(xl_file.sheet(4)), xl_file.sheet(4))
      update_generic_translations(Formulation, Formulation.get_translatable_params(xl_file.sheet(4)), xl_file.sheet(4))
      update_generic_translations(Instance, Instance.get_translatable_params(xl_file.sheet(5)), xl_file.sheet(5))
      update_generic_translations(HealthCares::Management, Node.get_translatable_params(xl_file.sheet(6)), xl_file.sheet(6))
      update_generic_translations(QuestionsSequence, Node.get_translatable_params(xl_file.sheet(7)), xl_file.sheet(7))
    end
  end

  # Generic method to update translations for a given model with a given ID from excel sheet
  def update_generic_translations(model, params, data)
    data.each_with_index do |row, index|
      if index != 0 && row[1] == model.to_s
        diagnosis = model.find(row[0])
        unless diagnosis.nil?
          diagnosis_params = {}
          params.map do |field, col|
            diagnosis_params[field] = row[col]
          end

          diagnosis.update!(diagnosis_params)
        end
      end
    end
  end

  def update_specific_translations(data)
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
          translations[language] = row[2+i]
        end
        params = {}
        params[field_to_update] = translations
        object.update!(params)
      end
    end
  end
end