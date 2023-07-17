class ExportVariablesService
  def self.process(version_id)
    @wb = Axlsx::Package.new
    @wrap = @wb.workbook.styles.add_style alignment: {wrap_text: true}
    @align_top = @wb.workbook.styles.add_style border: { style: :thin, color: "000000" }, alignment: {horizontal: :left, vertical: :top, wrap_text: true}
    @align_mid = @wb.workbook.styles.add_style b: true, bg_color: "D9D9D9", border: { style: :thin, color: "000000" }, alignment: {horizontal: :center , vertical: :center, wrap_text: true}

    old_language = I18n.default_locale
    @algorithm = Algorithm.find(version_id)
    
    @diagnoses = []
    @drugs = @algorithm.project.drugs.includes(:formulations)
    @managements = @algorithm.project.managements
    @variables = @algorithm.project.variables

    @current_language = @algorithm.project.language.code
    I18n.default_locale = @current_language

    generate_variables
    generate_decision_trees
    generate_diagnoses
    generate_questions_sequences
    generate_drugs
    generate_drugs_instances
    generate_managements
    # generate_medias

    I18n.default_locale = old_language

    # Generate the file with a unique name
    file_path = Rails.root.join('public', 'exports', "#{SecureRandom.hex}.xlsx")
    @wb.serialize(file_path)

    # Return the file name or path for future reference
    file_path.to_s
  end

  def self.generate_variables
    @wb.workbook.add_worksheet(name: "Variables") do |sheet|
      sheet.add_row ["ID", "Category", "Reference", "Label", "Neonat", "System", "Mandatory", "Identifiable",
                     "Estimable", "Emergency status", "Round", "Description", "Conditioning complaint categories",
                     "Answers (ID | full label)", "Uses"]

      @variables.map do |variable|
        answers = ""
        variable.answers.includes(:node).each_with_index do |answer, index|
          answers += "\r" unless index == 0
          answers += "#{answer.id} | #{answer.reference_label(@current_language)}"
        end

        complaint_categories = variable.complaint_categories.map(&:full_reference).to_s unless variable.is_a?(Variables::ComplaintCategory) || variable.complaint_categories.empty?

        sheet.add_row [variable.id, I18n.t("questions.categories.#{variable.variable_type}.label"),
                       variable.full_reference, variable.label, variable.is_neonat.to_s,
                       variable.system.present? ? I18n.t("questions.systems.#{variable.system}") : '',
                       variable.is_mandatory.to_s, variable.is_identifiable.to_s, variable.is_estimable.to_s,
                       variable.emergency_status.present? ? I18n.t("activerecord.attributes.question.emergency_statuses.#{variable.emergency_status}") : '',
                       variable.round, variable.description, complaint_categories, answers,
                       variable.instances.map(&:diagram).map{|diag| diag.reference_label(@current_language)}.join("\r")], style: @wrap
      end
    end
  end

  def self.generate_decision_trees
    @wb.workbook.add_worksheet(name: "Decision Trees") do |sheet|
      sheet.add_row ["ID", "Reference", "Label", "CC", "Cutoff start (days)", "Cutoff end (days)"]
      @algorithm.decision_trees.map do |decision_tree|
        sheet.add_row [decision_tree.id, decision_tree.full_reference, decision_tree.label,
                       decision_tree.node.full_reference,decision_tree.cut_off_start, decision_tree.cut_off_end]

        decision_tree.diagnoses.map do |diagnosis|
          @diagnoses.push(diagnosis)
        end
      end
    end
  end

  def self.generate_diagnoses
    @wb.workbook.add_worksheet(name: "Diagnoses") do |sheet|
      sheet.add_row ["ID", "Reference", "Label", "Level of urgency", "Description"]

      @diagnoses.map do |diagnosis|
        sheet.add_row [diagnosis.id, diagnosis.full_reference, diagnosis.label, diagnosis.level_of_urgency, diagnosis.description], style: @wrap
      end
    end
  end

  def self.generate_questions_sequences
    questions_sequences = @algorithm.project.questions_sequences.includes(:instances)

    @wb.workbook.add_worksheet(name: "Questions sequences") do |sheet|
      sheet.add_row ["ID", "Reference", "Label", "Cutoff start (days)", "Cutoff end (days)", "Minimum score",
                     "Description", "Conditioning complaint categories", "Uses"]

      questions_sequences.map do |qs|
        complaint_categories = qs.complaint_categories.map(&:full_reference).to_s unless qs.complaint_categories.empty?

        sheet.add_row [qs.id, qs.full_reference, qs.label, qs.cut_off_start, qs.cut_off_end, qs.min_score,
                       qs.description, complaint_categories,
                       qs.instances.map(&:diagram).map{|diag| diag.reference_label(@current_language)}.join("\r")
                      ], style: @wrap
      end
    end
  end

  def self.generate_drugs
    @wb.workbook.add_worksheet(name: "Drugs") do |sheet|
      sheet.add_row ["ID", "Reference", "Label", "Level of urgency", "Description", "Diagnoses",
                     "YI/Antibiotic/Antimalarial/None", "Formulations (ID | medication form)", "Administration route",
                     "Number of administrations per day", "Fixed Dose (Y/N)", "Is the tablet breakable",
                     "Concentration (mg in dose)", "Total drug formulation volume (ml)",
                     "Total drug formulation volume (mg)", "Number of pills per administration",
                     "Number of ml per administration", "Number of applications per administration",
                     "Maximal daily dose (mg)", "Minimal dose (mg/kg/day)", "Maximal dose (mg/kg/day)", "Description",
                     "Injection dilution instructions", "Dispensing description"], height: 99, style: @align_mid

      @drugs.uniq.map do |node|
        drug_rows = []

        bools = ""
        bools += "YI \r" if node.is_neonat
        bools += "Antibiotic \r" if node.is_antibiotic
        bools += "Antimalarial \r" if node.is_anti_malarial

        node.formulations.each_with_index do |formulation, index|
          row = index == 0 ? [node.id, node.full_reference, node.label, node.level_of_urgency, node.description,
                              node.instances.map(&:diagram).map{|diag| diag.reference_label(@current_language)}.join("\r"), bools] : ['', '', '', '', '', '', '']

          row.push("#{formulation.id} | #{I18n.t("formulations.medication_forms.#{formulation.medication_form}")}",
                   formulation.administration_route.name, formulation.doses_per_day, formulation.by_age ? 'Y' : 'N',
                   formulation.breakable.present? ? I18n.t("formulations.breakables.#{formulation.breakable}.label") : '',
                   formulation.liquid_concentration)

          # Logic to display the dose_form in the correct column
          if %w(capsule tablet dispersible_tablet).include?(formulation.medication_form)
            if formulation.by_age
              row.push('-', '-', formulation.unique_dose, '-', '-')
            else
              row.push('-', formulation.dose_form, '-', '-', '-')
            end
          elsif %w(syrup suspension solution powder_for_injection).include?(formulation.medication_form)
            if formulation.by_age
              row.push('-', '-', '-', formulation.unique_dose, '-')
            else
              row.push(formulation.dose_form, '-', '-', '-', '-')
            end
          else
            row.push('-', '-', '-', '-', formulation.unique_dose)
          end

          row.push(formulation.maximal_dose, formulation.minimal_dose_per_kg, formulation.maximal_dose_per_kg,
                   formulation.description, formulation.injection_instructions, formulation.dispensing_description)
          row = sheet.add_row row, style: @align_top
          drug_rows.push(row)
        end

        %w(A B C D E F G).each do |col|
          cells = "#{col}#{drug_rows.first.row_index + 1}:#{col}#{drug_rows.last.row_index + 1}"
          sheet.merge_cells(cells)
        end if drug_rows.any?

        sheet.column_widths(10, 10, 17, 10, 32, 32, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 32, 32, 32)
      end
    end
  end

  def self.generate_drugs_instances
    @wb.workbook.add_worksheet(name: "Drugs in diagnoses") do |sheet|

      sheet.add_row ["ID", "Drug", "Diagnosis", "Duration"]

      @drugs.map(&:instances).flatten.map do |instance|
        sheet.add_row [instance.id, instance.node.reference_label(@current_language), 
                       instance.diagnosis.reference_label(@current_language),
                       instance.is_pre_referral ? 'pre referral' : instance.duration]
      end
    end
  end
  
  def self.generate_managements
    @wb.workbook.add_worksheet(name: "Managements") do |sheet|
      sheet.add_row ["ID", "Reference", "Label", "Referral", "Level of urgency", "Description", "Uses"]

      @managements.map do |management|
        sheet.add_row [management.id, management.full_reference, management.label, management.is_referral.to_s,
                       management.level_of_urgency, management.description,
                       management.instances.map(&:diagram).map{|diag| diag.reference_label(@current_language)}.join("\r")
                      ], style: @wrap
      end
    end
  end

  def self.generate_medias
    @wb.workbook.add_worksheet(name: "Media") do |sheet|
      sheet.add_row ["ID", "Node type", "Node label", "Media label", "Link"]
      medias = Media.where(fileable_type: 'Node', fileable_id: (@drugs.map(&:id) + @managements.map(&:id) + @variables.map(&:id)))
      medias.map do |media|
        sheet.add_row [media.id, media.fileable.type, media.fileable.reference_label(@current_language), media.label, media.url.url], style: @wrap
      end
    end

  end
end