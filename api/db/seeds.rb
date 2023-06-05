require 'open-uri'

puts 'Starting seed'
en = Language.find_or_create_by!(code: 'en', name: 'English')
fr = Language.find_or_create_by!(code: 'fr', name: 'French')

User.create(role: 'admin', email: 'dev-admin@wavemind.ch', first_name: 'Quentin', last_name: 'Doe', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

User.create(role: 'clinician', email: 'dev@wavemind.ch', first_name: 'Alain', last_name: 'Fresco', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

boolean = AnswerType.create!(value: 'Boolean', display: 'RadioButton', label_key: 'boolean')
dropdown_list = AnswerType.create!(value: 'Array', display: 'DropDownList', label_key: 'dropdown_list')
input_integer = AnswerType.create!(value: 'Integer', display: 'Input', label_key: 'integer')
input_float = AnswerType.create!(value: 'Float', display: 'Input', label_key: 'float')
formula = AnswerType.create!(value: 'Float', display: 'Formula', label_key: 'formula')
date = AnswerType.create!(value: 'Date', display: 'Input', label_key: 'date')
present_absent = AnswerType.create!(value: 'Present', display: 'RadioButton', label_key: 'present_absent')
positive_negative = AnswerType.create!(value: 'Positive', display: 'RadioButton', label_key: 'positive_negative')
string = AnswerType.create!(value: 'String', display: 'Input', label_key: 'string')

if Rails.env.test?
  puts 'Creating Test data'
  project = Project.create!(name: 'Project for Tanzania', language: en)
  algo = project.algorithms.create!(name: 'First algo', age_limit: 5, age_limit_message_en: 'Message',
                                    description_en: 'Desc')
  cc = project.variables.create!(type: 'Variables::ComplaintCategory', answer_type: boolean, label_en: 'General')
  cough = project.variables.create!(type: 'Variables::Symptom', answer_type: boolean, label_en: 'Cough',
                                    system: 'general')
  refer = project.managements.create!(type: 'HealthCares::Management', label_en: 'refer')
  cough_yes = cough.answers.create!(label_en: 'Yes')
  cough_no = cough.answers.create!(label_en: 'No')
  fever = project.variables.create!(type: 'Variables::Symptom', answer_type: boolean, label_en: 'Fever',
                                    system: 'general')
  fever_yes = fever.answers.create!(label_en: 'Yes')
  fever_no = fever.answers.create!(label_en: 'No')
  dt_cold = algo.decision_trees.create!(node: cc, label_en: 'Cold')
  dt_hiv = algo.decision_trees.create!(node: cc, label_en: 'HIV')
  d_cold = dt_cold.diagnoses.create!(label_en: 'Cold', project: project)
  d_diarrhea = dt_cold.diagnoses.create!(label_en: 'Diarrhea', project: project)
  cough_instance = dt_cold.components.create!(node: cough)
  fever_instance = dt_cold.components.create!(node: fever)
  cold_instance = dt_cold.components.create!(node: d_cold)
  cold_instance.conditions.create!(answer: cough_yes)
  cold_instance.conditions.create!(answer: fever_yes)
  refer_d_instance = dt_cold.components.create!(node: refer, diagnosis: d_cold)
  cough_d_instance = dt_cold.components.create!(node: cough, diagnosis: d_cold)
  fever_d_instance = dt_cold.components.create!(node: fever, diagnosis: d_cold)
  refer_d_instance.conditions.create!(answer: cough_yes)
  refer_d_instance.conditions.create!(answer: cough_no)
  refer_d_instance.conditions.create!(answer: fever_yes)
  cough_d_instance.conditions.create!(answer: fever_no)

# elsif File.exist?('db/old_data.json')
#   data = JSON.parse(File.read(Rails.root.join('db/old_data.json')))
#   # medias = JSON.parse(File.read(Rails.root.join('db/old_medias.json')))
elsif File.exist?('db/old_data.json')
  data = JSON.parse(File.read(Rails.root.join('db/old_data.json')))
  # medias = JSON.parse(File.read(Rails.root.join('db/old_medias.json')))
  medias = []
  puts '--- Creating users'
  data['users'].each do |user|
    User.create!(
      first_name: user['first_name'],
      last_name: user['last_name'],
      email: user['email'],
      role: user['role'],
      password: ENV['USER_DEFAULT_PASSWORD'],
      password_confirmation: ENV['USER_DEFAULT_PASSWORD'],
      old_medalc_id: user['id']
    )
  end

  Variable.skip_callback(:create, :after, :add_to_consultation_orders) # Avoid going through order reformat

  data['algorithms'].each do |algorithm|
    project = Project.create!(
      algorithm.slice('name', 'project', 'medal_r_config', 'village_json', 'consent_management', 'track_referral',
                      'emergency_content_version', 'emergency_content_translations')
              .merge(language: en, study_description_translations: algorithm['study']['description_translations'])
    )

    algorithm['study']['users'].each do |user|
      user = User.find_by(old_medalc_id: user['id'])
      project.users << user if user.present?
    end

    node_complaint_categories_to_rerun = []
    variables_to_rerun = []

    puts '--- Creating variables'

    Variable.skip_callback(:create, :after, :create_boolean)
    Variable.skip_callback(:create, :after, :create_positive)
    Variable.skip_callback(:create, :after, :create_present)

    algorithm['questions'].each do |question|
      answer_type = AnswerType.find_or_create_by(
        display: question['answer_type']['display'],
        value: question['answer_type']['value']
      )

      new_variable = Variable.create!(
        question.slice('reference', 'label_translations', 'description_translations', 'is_neonat',
                       'is_danger_sign', 'stage', 'system', 'step', 'formula', 'round', 'is_mandatory', 'is_identifiable',
                       'is_referral', 'is_pre_fill', 'is_default', 'emergency_status', 'min_value_warning',
                       'max_value_warning', 'min_value_error', 'max_value_error', 'min_message_error_translations',
                       'max_message_error_translations', 'min_message_warning_translations',
                       'max_message_warning_translations', 'placeholder_translations')
                .merge(
                  project: project,
                  answer_type: answer_type,
                  is_unavailable: question['unavailable'],
                  is_estimable: question['estimable'],
                  reference_table_male_name: question['reference_table_male'],
                  reference_table_female_name: question['reference_table_female'],
                  type: question['type'].gsub('Questions::', 'Variables::'),
                  old_medalc_id: question['id'],
                  # Create hstore elsewhere to avoid value to be forced as nil
                  placeholder_translations: question['placeholder_translations'] || {},
                  min_message_error_translations: question['min_message_error_translations'] || {},
                  max_message_error_translations: question['max_message_error_translations'] || {},
                  min_message_warning_translations: question['min_message_warning_translations'] || {},
                  max_message_warning_translations: question['max_message_warning_translations'] || {},
                )
      )

      # question['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_variable.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      variables_to_rerun.push({ hash: question, data: new_variable }) if new_variable.reference_table_male_name.present?
      node_complaint_categories_to_rerun.concat(question['node_complaint_categories'])

      question['answers'].each do |answer|
        new_variable.answers.create!(answer.slice('reference', 'label_translations', 'operator', 'value')
                                          .merge(old_medalc_id: answer['id'], is_unavailable: answer['unavailable']))
      end
    end

    puts '--- Creating reference table'
    variables_to_rerun.each do |entry|
      hash = entry[:hash]
      data = entry[:data]

      data.reference_table_x = Node.find_by(old_medalc_id: hash['reference_table_x_id'])
      data.reference_table_y = Node.find_by(old_medalc_id: hash['reference_table_y_id'])
      data.reference_table_z = Node.find_by(old_medalc_id: hash['reference_table_z_id'])
      data.save
    end

    puts '--- Creating question sequences'
    qs_to_rerun = []
    algorithm['questions_sequences'].each do |qs|
      new_qs = project.nodes.create!(qs.slice('reference', 'label_translations', 'type', 'description_translations',
                                              'is_neonat', 'min_score', 'cut_off_start', 'cut_off_end')
                                      .merge(old_medalc_id: qs['id']))
      qs_to_rerun.push({ hash: qs, data: new_qs })
      node_complaint_categories_to_rerun.concat(qs['node_complaint_categories'])

      # qs['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_qs.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      qs['answers'].each do |answer|
        new_qs.answers.create!(answer.slice('reference', 'label_translations', 'operator', 'value')
                                    .merge(old_medalc_id: answer['id']))
      end
    end

    puts '--- Creating components'
    instances_to_rerun = []
    qs_to_rerun.each do |entry|
      hash = entry[:hash]
      data = entry[:data]
      hash['components'].each do |instance|
        node = Node.find_by(old_medalc_id: instance['node_id'])
        new_instance = data.components.create!(
          node: node,
          old_medalc_id: instance['id'],
          position_x: instance['position_x'],
          position_y: instance['position_y'],
          is_pre_referral: instance['is_pre_referral'] || false,
          duration_translations: instance['duration_translations'] || {},
          description_translations: instance['description_translations'] || {}
        )
        instances_to_rerun.push({ hash: instance, data: new_instance })
      end
    end

    puts '--- Creating conditions'
    instances_to_rerun.each do |entry|
      hash = entry[:hash]
      data = entry[:data]
      hash['conditions'].each do |condition|
        answer = Answer.find_by(old_medalc_id: condition['answer_id'])
        next if answer.nil?

        data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
        parent_instance = data.instanceable.components.find_by(node: answer.node)
        Child.create!(node: data.node, instance: parent_instance)
      end
    end

    puts '--- Creating CC'
    node_complaint_categories_to_rerun.each do |node_complaint_category|
      cc = Node.find_by(old_medalc_id: node_complaint_category['complaint_category_id'])
      node = Node.find_by(old_medalc_id: node_complaint_category['node_id'])
      NodeComplaintCategory.create!(complaint_category: cc, node: node) if cc.present? && node.present?
    end

    puts '--- Creating drugs'
    exclusions_to_run = []
    algorithm['drugs'].each do |drug|
      new_drug = project.nodes.create!(drug.slice('reference', 'label_translations', 'type', 'description_translations',
                                                  'is_neonat', 'is_danger_sign', 'is_anti_malarial', 'is_antibiotic',
                                                  'level_of_urgency').merge(old_medalc_id: drug['id']))

      exclusions_to_run.concat(drug['node_exclusions'])

      # drug['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_drug.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      drug['formulations'].each do |formulation|
        administration_route = AdministrationRoute.find_or_create_by(
          formulation['administration_route'].slice('category', 'name_translations')
        )
        new_drug.formulations.create!(formulation.slice('minimal_dose_per_kg', 'maximal_dose_per_kg', 'maximal_dose',
                                                        'medication_form', 'dose_form', 'liquid_concentration',
                                                        'doses_per_day', 'unique_dose', 'breakable', 'by_age')
                                                .merge(
                                                  administration_route: administration_route,
                                                  description_translations: formulation['description_translations'] || {},
                                                  injection_instructions_translations: formulation['injection_instructions_translations'] || {},
                                                  dispensing_description_translations: formulation['dispensing_description_translations'] || {},
                                                ))
      end
    end

    puts '--- Creating managements'
    algorithm['managements'].each do |management|
      new_management = project.nodes.create!(management.slice('reference', 'label_translations', 'type', 'description_translations',
                                                              'is_neonat', 'is_danger_sign', 'level_of_urgency')
                                      .merge(old_medalc_id: management['id']))

      # management['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_management.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      exclusions_to_run.concat(management['node_exclusions'])
    end

    puts '--- Creating versions'
    algorithm['versions'].each do |version|
      next unless version['name'] == 'ePOCT+_DYN_TZ_V2.0'

      new_algorithm = project.algorithms.create!(version.slice('name', 'medal_r_json', 'medal_r_json_version', 'job_id',
                                                               'description_translations', 'minimum_age',
                                                               'age_limit', 'age_limit_message_translations'))
      new_algorithm.status = version['in_prod'] ? 'prod' : 'draft'
      new_algorithm.mode = version['is_arm_control'] ? 'arm_control' : 'intervention'

      ordered_ids = []
      order = JSON.parse(version['full_order_json'])
      order.each do |step|
        step['children'].each do |child|
          if child.key?('children')
            child['children'].each do |grandchild|
              ordered_ids << Node.find_by(old_medalc_id: grandchild['id']).id
            end
          else
            ordered_ids << Node.find_by(old_medalc_id: child['id']).id unless child['id'].is_a?(String)
          end
        end
      end
      new_algorithm.full_order_json = new_algorithm.generate_consultation_order(Node.find(ordered_ids))

      new_algorithm.save

      version['languages'].each do |language|
        language = Language.find_or_create_by(language.slice('name', 'code'))
        new_algorithm.algorithm_languages.create!(language: language)
      end

      version['medal_data_config_variables'].each do |variable|
        new_variable = Node.find_by(old_medalc_id: variable['question_id'])
        new_algorithm.medal_data_config_variables.create!(variable.slice('label',
                                                                         'api_key').merge(variable: new_variable))
      end

      instances_to_rerun = []
      version['components'].each do |instance|
        node = Node.find_by(old_medalc_id: instance['node_id'])
        new_instance = new_algorithm.components.create!(
          node: node,
          old_medalc_id: instance['id'],
          position_x: instance['position_x'],
          position_y: instance['position_y'],
          is_pre_referral: instance['is_pre_referral'] || false,
          duration_translations: instance['duration_translations'] || {},
          description_translations: instance['description_translations'] || {}
        )
        instances_to_rerun.push({ hash: instance, data: new_instance })
      end

      instances_to_rerun.each do |entry|
        hash = entry[:hash]
        data = entry[:data]
        hash['conditions'].each do |condition|
          answer = Answer.find_by(old_medalc_id: condition['answer_id'])
          next if answer.nil?

          data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
          parent_instance = data.instanceable.components.find_by(node: answer.node)
          Child.create!(node: data.node, instance: parent_instance)
        end
      end

      puts '--- Creating diagnoses'
      version['diagnoses'].each do |diagnosis|
        cc = Node.find_by(old_medalc_id: diagnosis['node_id'])
        decision_tree = new_algorithm.decision_trees.create!(diagnosis.slice('reference', 'label_translations',
                                                                             'cut_off_start', 'cut_off_end')
                                                                      .merge(node: cc))
        diagnosis['final_diagnoses'].each do |final_diagnosis|
          new_final_diagnosis = project.nodes.create!(final_diagnosis.slice('reference', 'label_translations', 'description_translations',
                                                                            'is_neonat', 'is_danger_sign', 'level_of_urgency')
                                              .merge(decision_tree: decision_tree, type: 'Diagnosis',
                                                     old_medalc_id: final_diagnosis['id']))

          # final_diagnosis['medias'].each do |media|
          #   url = medias[media['id'].to_s]
          #   new_final_diagnosis.files.attach(io: URI.open(url), filename: File.basename(url))
          # end

          exclusions_to_run.concat(final_diagnosis['node_exclusions'])
        end

        instances_to_rerun = []
        diagnosis['components'].each do |instance|
          node = Node.find_by(old_medalc_id: instance['node_id'])
          next if node.nil?

          diagnosis = instance['final_diagnosis_id'].present? ? Node.find_by(old_medalc_id: instance['final_diagnosis_id']).id : nil
          new_instance = decision_tree.components.create!(
            node: node,
            diagnosis_id: diagnosis,
            old_medalc_id: instance['id'],
            position_x: instance['position_x'],
            position_y: instance['position_y'],
            is_pre_referral: instance['is_pre_referral'] || false,
            duration_translations: instance['duration_translations'] || {},
            description_translations: instance['description_translations'] || {}
            )
          instances_to_rerun.push({ hash: instance, data: new_instance })
        end

        instances_to_rerun.each do |entry|
          hash = entry[:hash]
          data = entry[:data]
          hash['conditions'].each do |condition|
            answer = Answer.find_by(old_medalc_id: condition['answer_id'])
            next if answer.nil?

            data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
            parent_instance = data.instanceable.components.find_by(node: answer.node)
            Child.create!(node: data.node, instance: parent_instance)
          end
        end
      end
    end

    exclusions_to_run.each do |exclusion|
      excluding_node = Node.find_by(old_medalc_id: exclusion['excluding_node_id'])
      excluded_node = Node.find_by(old_medalc_id: exclusion['excluded_node_id'])
      node_type = exclusion['node_type'] == 'final_diagnosis' ? 'diagnosis' : exclusion['node_type']
      NodeExclusion.create(excluding_node: excluding_node, excluded_node: excluded_node, node_type: node_type)
    end
  end
end

puts 'Seed finished'
