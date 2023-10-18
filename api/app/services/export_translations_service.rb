class ExportTranslationsService
  def self.process(algorithm_id)
    file = Axlsx::Package.new
    @wb = file.workbook
    @wrap = @wb.styles.add_style alignment: {wrap_text: true}
    @unlocked = @wb.styles.add_style locked: false

    @algorithm = Algorithm.find(algorithm_id)

    @decision_trees = @algorithm.decision_trees

    @diagnoses = []
    @drugs = []
    @managements = []
    @questions_sequences = []
    @variables = []

    @languages_codes = Language.all.map(&:code)
    @current_language = @algorithm.project.language.code

    generate_general
    generate_decision_trees
    generate_diagnoses
    generate_variables
    generate_drugs
    generate_drugs_instances
    generate_managements
    generate_questions_sequences

    UploadFileService.upload_export(file, "exports/export_translations_#{SecureRandom.hex}.xlsx")
  end

  def self.generate_decision_trees
    # Build DecisionTree sheet
    @wb.add_worksheet(name: "Decision trees") do |sheet|
      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end
      sheet.add_row rows
      # Generate lists of node not yet set
      @decision_trees.includes(components: :node).map do |diag|
        diag.components.map do |instance|
          node = instance.node
          if node.is_a? Diagnosis
            @diagnoses.push(node)
          elsif node.is_a? Variable
            @variables.push(node)
          elsif node.is_a? QuestionsSequence
            @questions_sequences.push(node)
          elsif node.is_a? HealthCares::Drug
            @drugs.push(node)
          elsif node.is_a? HealthCares::Management
            @managements.push(node)
          end
        end

        rows = [diag.id, 'Decision Tree', diag.full_reference]
        @languages_codes.map do |l|
          rows.push(diag.send("label_#{l}"))
        end
        sheet.add_row rows
      end
      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end

      # Remove duplicates
      @variables = @variables.uniq
      @questions_sequences = @questions_sequences.uniq
      @diagnoses = @diagnoses.uniq
      @drugs = @drugs.uniq
      @managements = @managements.uniq
    end
  end

  def self.generate_diagnoses
    # Build Diagnosis sheet
    @wb.add_worksheet(name: "Diagnoses") do |sheet|
      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end
      sheet.add_row rows, style: @wrap

      @diagnoses.map do |node|
        rows = [node.id, "Diagnosis", node.full_reference]

        @languages_codes.map do |l|
          rows.push(node.send("label_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("description_#{l}"))
        end

        sheet.add_row rows, style: @wrap
      end
      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end
    end
  end

  def self.generate_drugs
    # Build Drug sheet
    @wb.add_worksheet(name: "Drugs") do |sheet|

      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Injection instructions (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Dispensing description (#{l})")
      end
      sheet.add_row rows, style: @wrap

      @drugs.map do |node|
        rows = [node.id, 'HealthCares::Drug', node.full_reference]
        @languages_codes.map do |l|
          rows.push(node.send("label_#{l}"))
        end
        @languages_codes.map do |l|
          rows.push(node.send("description_#{l}"))
        end

        sheet.add_row rows, style: @wrap

        node.formulations.each_with_index do |formulation, index|
          rows = [formulation.id, 'Formulation', '-', '-']
          @languages_codes.map do |l|
            rows.push('-')
          end
          @languages_codes.map do |l|
            rows.push(formulation.send("description_#{l}"))
          end
          @languages_codes.map do |l|
            rows.push(formulation.send("injection_instructions_#{l}"))
          end
          @languages_codes.map do |l|
            rows.push(formulation.send("dispensing_description_#{l}"))
          end
          sheet.add_row rows, style: @wrap
        end
      end
      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end
    end
  end

  def self.generate_drugs_instances
    @wb.add_worksheet(name: "Drugs in diagnoses") do |sheet|

      rows = ["ID", "Model", "Drug", "Decision tree"]

      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Duration (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end

      sheet.add_row rows, style: @wrap

      @diagnoses.map(&:components).flatten.each_with_index do |instance, index|
        if instance.node.is_a?(HealthCares::Drug)
          instance.disable_fallback
          rows = [instance.id, 'Instance', instance.node.reference_label(@current_language), instance.diagnosis.reference_label(@current_language)]

          @languages_codes.map do |l|
            rows.push(instance.send("duration_#{l}"))
          end
          @languages_codes.map do |l|
            rows.push(instance.send("description_#{l}"))
          end

          sheet.add_row rows, style: @wrap
          instance.enable_fallback
        end
      end
    end
  end

  def self.generate_general
    @wb.add_worksheet(name: "General") do |sheet|
      rows = %w[ID Model Field]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("#{l}")
      end
      sheet.add_row rows

      rows = [@algorithm.id, 'Algorithm', "Age limit message"]
      @languages_codes.map do |l|
        rows.push(@algorithm.send("age_limit_message_#{l}"))
      end
      sheet.add_row rows

      rows = [@algorithm.id, 'Algorithm', "Description"]
      @languages_codes.map do |l|
        rows.push(@algorithm.send("description_#{l}"))
      end
      sheet.add_row rows
    end
  end

  def self.generate_managements
    # Build Management sheet
    @wb.add_worksheet(name: "Managements") do |sheet|

      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end
      sheet.add_row rows, style: @wrap

      @managements.map do |node|
        rows = [node.id, "HealthCares::Management", node.full_reference]
        @languages_codes.map do |l|
          rows.push(node.send("label_#{l}"))
        end
        @languages_codes.map do |l|
          rows.push(node.send("description_#{l}"))
        end

        sheet.add_row rows, style: @wrap
      end

      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end
    end
  end

  def self.generate_questions_sequences
    # Build Questions sequences sheet
    @wb.add_worksheet(name: "Questions sequences") do |sheet|

      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end
      sheet.add_row rows, style: @wrap

      @questions_sequences.map do |node|
        rows = [node.id, 'QuestionsSequence', node.full_reference]
        @languages_codes.map do |l|
          rows.push(node.send("label_#{l}"))
        end
        @languages_codes.map do |l|
          rows.push(node.send("description_#{l}"))
        end

        sheet.add_row rows, style: @wrap
      end
      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end
    end
  end

  def self.generate_variables
    # Build Question sheet
    @wb.add_worksheet(name: "Variables") do |sheet|

      # Generate columns depending on different languages
      rows = %w[ID Model Reference]
      unlocked_rows_indexes = []
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Label (#{l})")
      end
      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Description (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Min message warning (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Max message warning (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Min message error (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Max message error (#{l})")
      end

      @languages_codes.map do |l|
        unlocked_rows_indexes.push(rows.count)
        rows.push("Placeholder (#{l})")
      end
      # Create first line (with column names)
      sheet.add_row rows

      @variables.map do |node|
        rows = [node.id, 'Question', node.full_reference]
        @languages_codes.map do |l|
          rows.push(node.send("label_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("description_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("min_message_warning_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("max_message_warning_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("min_message_error_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("max_message_error_#{l}"))
        end

        @languages_codes.map do |l|
          rows.push(node.send("placeholder_#{l}"))
        end

        sheet.add_row rows, style: @wrap

        node.answers.includes(:node).each_with_index do |answer, index|
          rows = [answer.id, 'Answer', answer.full_reference]
          @languages_codes.map do |l|
            rows.push(answer.send("label_#{l}"))
          end
          sheet.add_row rows, style: @wrap
        end unless [1,7,8].include?(node.answer_type_id)
      end
      unlocked_rows_indexes.map do |i|
        sheet.col_style(i,@unlocked,row_offset: 0)
      end
    end
  end
end