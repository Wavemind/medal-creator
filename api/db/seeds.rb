require 'open-uri'

puts 'Starting seed'
EN = Language.find_or_create_by!(code: 'en', name: 'English')
FR = Language.find_or_create_by!(code: 'fr', name: 'French')
HI = Language.find_or_create_by!(code: 'hi', name: 'Hindi')
RW = Language.find_or_create_by!(code: 'rw', name: 'Kinyarwanda')
SW = Language.find_or_create_by!(code: 'sw', name: 'Swahili')

admin = User.create(role: 'admin', email: 'dev-admin@wavemind.ch', first_name: 'Dev', last_name: 'Admin', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

project_admin = User.create(role: 'viewer', email: 'project-admin@wavemind.ch', first_name: 'Project', last_name: 'Admin', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

clinician = User.create(role: 'clinician', email: 'clinician@wavemind.ch', first_name: 'Clin', last_name: 'Ician', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

deployment_manager = User.create(role: 'deployment_manager', email: 'deployment-manager@wavemind.ch', first_name: 'Deployment', last_name: 'Manager', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

viewer = User.create(role: 'viewer', email: 'viewer@wavemind.ch', first_name: 'View', last_name: 'Er', password: ENV['USER_DEFAULT_PASSWORD'],
            password_confirmation: ENV['USER_DEFAULT_PASSWORD'])

# Answer types
BOOLEAN = AnswerType.create!(value: 'Boolean', display: 'RadioButton', label_key: 'boolean')
DROPDOWN_LIST = AnswerType.create!(value: 'Array', display: 'DropDownList', label_key: 'dropdown_list')
INPUT_INTEGER = AnswerType.create!(value: 'Integer', display: 'Input', label_key: 'integer')
INPUT_FLOAT = AnswerType.create!(value: 'Float', display: 'Input', label_key: 'float')
FORMULA = AnswerType.create!(value: 'Float', display: 'Formula', label_key: 'formula')
DATE = AnswerType.create!(value: 'Date', display: 'Input', label_key: 'date')
PRESENT_ABSENT = AnswerType.create!(value: 'Present', display: 'RadioButton', label_key: 'present_absent')
POSITIVE_NEGATIVE = AnswerType.create!(value: 'Positive', display: 'RadioButton', label_key: 'positive_negative')
STRING = AnswerType.create!(value: 'String', display: 'Input', label_key: 'string')

# Administration routes
AdministrationRoute.create!(category: 'Enteral', name: 'Orally')
AdministrationRoute.create!(category: 'Enteral', name: 'Sublingually')
AdministrationRoute.create!(category: 'Enteral', name: 'Rectally')
AdministrationRoute.create!(category: 'Parenteral injectable', name: 'IV')
AdministrationRoute.create!(category: 'Parenteral injectable', name: 'IM')
AdministrationRoute.create!(category: 'Parenteral injectable', name: 'SC')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Ocular')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Otic')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Nasally')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Inhalation')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Cutaneous')
AdministrationRoute.create!(category: 'Mucocutaneous', name: 'Transdermally')

def create_project(name)
  project = Project.create!(name: name, language: EN, old_medalc_id: 1, emergency_content_version: 1,
    emergency_content_en: 'Emergency content')

  algo = project.algorithms.create!(name: 'First algo', age_limit: 5, age_limit_message_en: 'Message',
  minimum_age: 30, description_en: 'Desc', old_medalc_id: 1, mode: 'intervention')
  algo.medal_data_config_variables.create!(label: 'CC general', api_key: 'cc_general',
                      variable: Node.where(type: 'Variables::ComplaintCategory').first)
  cc = project.variables.create!(type: 'Variables::ComplaintCategory', answer_type: BOOLEAN, label_en: 'General')
  cough = project.variables.create!(type: 'Variables::Symptom', answer_type: BOOLEAN, label_en: 'Cough',
                system: 'general')
  heart_rate = project.variables.create!(type: 'Variables::VitalSignAnthropometric', answer_type: INPUT_FLOAT, label_en: 'Heart rate', system: 'general')
  last_vaccine = project.variables.create!(type: 'Variables::Demographic', answer_type: DATE, label_en: 'Last vaccine date')
  resp_distress = project.questions_sequences.create!(type: 'QuestionsSequences::PredefinedSyndrome',
                                  label_en: 'Respiratory Distress')
  refer = project.managements.create!(type: 'HealthCares::Management', label_en: 'refer')
  advise = project.managements.create!(type: 'HealthCares::Management', label_en: 'advise')
  panadol = project.drugs.create!(type: 'HealthCares::Drug', label_en: 'Panadol')
  administration_route = AdministrationRoute.first
  panadol.formulations.create!(medication_form: "cream", administration_route: administration_route, unique_dose: 2.5, doses_per_day: 2)
  amox = project.drugs.create!(type: 'HealthCares::Drug', label_en: 'Amox')
  amox.formulations.create!(medication_form: 'tablet', administration_route: administration_route, minimal_dose_per_kg: 1.0,
        maximal_dose_per_kg: 1.0, maximal_dose: 1.0, dose_form: 1.1, breakable: 'one', doses_per_day: 2)

  NodeExclusion.create!(excluded_node: panadol, excluding_node: amox, node_type: 'drug')
  NodeExclusion.create!(excluded_node: advise, excluding_node: refer, node_type: 'management')

  cough_yes = cough.answers.create!(label_en: 'Yes')
  cough_no = cough.answers.create!(label_en: 'No')
  fever = project.variables.create!(type: 'Variables::Symptom', answer_type: BOOLEAN, label_en: 'Fever',
                system: 'general', is_neonat: true)
  fever_yes = fever.answers.create!(label_en: 'Yes')
  fever_no = fever.answers.create!(label_en: 'No')
  dt_cold = algo.decision_trees.create!(node: cc, label_en: 'Cold')
  dt_hiv = algo.decision_trees.create!(node: cc, label_en: 'HIV')
  cough_instance = dt_cold.components.create!(node: cough)
  fever_instance = dt_cold.components.create!(node: fever)
  d_cold = dt_cold.diagnoses.create!(label_en: 'Cold', project: project)
  d_diarrhea = dt_cold.diagnoses.create!(label_en: 'Diarrhea', project: project)
  d_hiv = dt_hiv.diagnoses.create!(label_en: 'HIV', project: project)
  d_gastro = dt_hiv.diagnoses.create!(label_en: 'Gastro', project: project)

  NodeExclusion.create!(excluded_node: d_cold, excluding_node: d_diarrhea, node_type: 'diagnosis')

  cold_instance = dt_cold.components.find_by(node: d_cold)
  cold_instance.conditions.create!(answer: cough_yes)
  cold_instance.conditions.create!(answer: fever_yes)
  panadol_d_instance = dt_cold.components.create!(node: panadol, diagnosis: d_cold, duration_en: '2 to 3')
  amox_d_instance = dt_cold.components.create!(node: amox, diagnosis: d_cold, duration_en: '2 to 3')
  refer_d_instance = dt_cold.components.create!(node: refer, diagnosis: d_cold)
  cough_d_instance = dt_cold.components.create!(node: cough, diagnosis: d_cold)
  fever_d_instance = dt_cold.components.create!(node: fever, diagnosis: d_cold)
  refer_d_instance.conditions.create!(answer: cough_yes)
  refer_d_instance.conditions.create!(answer: cough_no)
  refer_d_instance.conditions.create!(answer: fever_yes)
  cough_d_instance.conditions.create!(answer: fever_no)

  project
end

if Rails.env.test?
  puts 'Creating Test data'

  viewer_project = create_project('Viewer project')
  viewer_project.users << viewer
  viewer_project.save!

  deployment_manager_project = create_project('Deployment manager project')
  deployment_manager_project.users << deployment_manager
  deployment_manager_project.save!

  clinician_project = create_project('Clinician project')
  clinician_project.users << clinician
  clinician_project.save!

  project_admin_project = create_project('Project admin project')
  project_admin_project.user_projects.create!(user: project_admin, is_admin: true)

  admin_project = create_project('Super admin project')
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

  Project.skip_callback(:create, :after, :create_default_variables)
  Variable.skip_callback(:create, :after, :add_to_consultation_orders) # Avoid going through order reformat
  Variable.skip_callback(:validation, :before, :validate_formula)

  data['algorithms'].each do |algorithm|
    project = Project.create!(
      algorithm.slice('name', 'project', 'medal_r_config', 'village_json', 'consent_management', 'track_referral',
                      'emergency_content_version', 'emergency_content_translations')
              .merge(
                language: EN,
                study_description_translations: algorithm['study']['description_translations'],
                old_medalc_id: algorithm['id']
              )
    )

    algorithm['study']['users'].each do |user|
      user = User.find_by(old_medalc_id: user['id'])
      project.users << user if user.present?
    end

    node_complaint_categories_to_rerun = []
    variables_to_rerun = []

    puts '--- Creating variables'

    QuestionsSequence.skip_callback(:create, :after, :create_boolean)
    Variable.skip_callback(:create, :after, :create_boolean)
    Variable.skip_callback(:create, :after, :create_positive)
    Variable.skip_callback(:create, :after, :create_present)
    Variable.skip_callback(:create, :after, :create_unavailable_answer)
    Diagnosis.skip_callback(:create, :after, :instantiate_in_diagram)

    algorithm['questions'].each do |question|
      answer_type = AnswerType.find_or_create_by(
        display: question['answer_type']['display'],
        value: question['answer_type']['value']
      )
      new_variable = Variable.create!(
        question.slice('reference', 'label_translations', 'description_translations',
                       'is_danger_sign', 'stage', 'system', 'step', 'round', 'is_mandatory', 'is_identifiable',
                       'is_referral', 'is_pre_fill', 'is_default', 'emergency_status', 'min_value_warning',
                       'max_value_warning', 'min_value_error', 'max_value_error', 'min_message_error_translations',
                       'max_message_error_translations', 'min_message_warning_translations',
                       'max_message_warning_translations', 'placeholder_translations')
                .merge(
                  project: project,
                  answer_type: answer_type,
                  is_unavailable: question['unavailable'],
                  is_estimable: question['estimable'],
                  is_neonat: question['is_neonat'] || false,
                  reference_table_male_name: question['reference_table_male'],
                  reference_table_female_name: question['reference_table_female'],
                  type: question['type'].gsub('Questions::', 'Variables::'),
                  old_medalc_id: question['id'],
                  formula: question['formatted_formula'],
                  # Create hstore elsewhere to avoid value to be forced as nil
                  placeholder_translations: question['placeholder_translations'] || {},
                  min_message_error_translations: question['min_message_error_translations'] || {},
                  max_message_error_translations: question['max_message_error_translations'] || {},
                  min_message_warning_translations: question['min_message_warning_translations'] || {},
                  max_message_warning_translations: question['max_message_warning_translations'] || {}
                )
      )

      # question['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_variable.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      variables_to_rerun.push({ hash: question, data: new_variable }) if new_variable.reference_table_male_name.present?
      if new_variable.is_a?(Variables::ComplaintCategory)
        node_complaint_categories_to_rerun.concat(question['node_complaint_categories'])
      end

      question['answers'].each do |answer|
        case answer_type
        when BOOLEAN
          label = Hash[Language.all.map(&:code).collect { |k| [k, I18n.t("answers.predefined.#{answer['reference'] == 1 ? 'yes' : 'no'}", locale: k)] } ]
        when PRESENT_ABSENT
          label = Hash[Language.all.map(&:code).collect { |k| [k, I18n.t("answers.predefined.#{answer['reference'] == 1 ? 'present' : 'absent'}", locale: k)] } ]
        when POSITIVE_NEGATIVE
          label = Hash[Language.all.map(&:code).collect { |k| [k, I18n.t("answers.predefined.#{answer['reference'] == 1 ? 'positive' : 'negative'}", locale: k)] } ]
        else
          label = answer['label_translations']
        end
        new_variable.answers.create!(answer.slice('reference', 'operator', 'value')
                                          .merge(old_medalc_id: answer['id'], label_translations: label))
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
                                              'min_score', 'cut_off_start', 'cut_off_end')
                                      .merge(old_medalc_id: qs['id'], is_neonat: qs['is_neonat'] || false))
      qs_to_rerun.push({ hash: qs, data: new_qs })
      node_complaint_categories_to_rerun.concat(qs['node_complaint_categories'])

      # qs['medias'].each do |media|
      #   url = medias[media['id'].to_s]
      #   new_qs.files.attach(io: URI.open(url), filename: File.basename(url))
      # end

      qs['answers'].each do |answer|
        new_qs.answers.create!(answer.slice('reference', 'operator', 'value')
                                    .merge(
                                      old_medalc_id: answer['id'],
                                      label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t("answers.predefined.#{answer['reference'] == 1 ? 'yes' : 'no'}", locale: k)] } ]
                                    )
        )
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

        data.conditions.create(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
      end
    end

    puts '--- Creating CC'
    node_complaint_categories_to_rerun.each do |node_complaint_category|
      cc = Node.find_by(old_medalc_id: node_complaint_category['complaint_category_id'])
      node = Node.find_by(old_medalc_id: node_complaint_category['node_id'])
      NodeComplaintCategory.create(complaint_category: cc, node: node) if cc.present? && node.present?
    end

    puts '--- Creating drugs'
    exclusions_to_run = []
    algorithm['drugs'].each do |drug|
      new_drug = project.nodes.create!(drug.slice('reference', 'label_translations', 'type', 'description_translations',
                                                  'is_danger_sign', 'level_of_urgency').merge(
        old_medalc_id: drug['id'],
        is_neonat: drug['is_neonat'] || false,
        is_antibiotic: drug['is_antibiotic'] || false,
        is_anti_malarial: drug['is_anti_malarial'] || false,
      ))

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
                                                  dispensing_description_translations: formulation['dispensing_description_translations'] || {}
                                                ))
      end
    end

    puts '--- Creating managements'
    algorithm['managements'].each do |management|
      new_management = project.nodes.create!(management.slice('reference', 'label_translations', 'type', 'description_translations',
                                                              'is_danger_sign', 'level_of_urgency')
                                      .merge(old_medalc_id: management['id'], is_neonat: management['is_neonat'] || false))

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
      new_algorithm.old_medalc_id = version['id']


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
                                                                            'is_danger_sign', 'level_of_urgency')
                                              .merge(decision_tree: decision_tree, type: 'Diagnosis',
                                                     old_medalc_id: final_diagnosis['id'], is_neonat: final_diagnosis['is_neonat'] || false))

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

            data.conditions.create(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
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

    # Rebuild medal_r_config
    config = project.medal_r_config
    config['basic_questions'].each do |key, old_medalc_id|
      config['basic_questions'][key] = Node.find_by(old_medalc_id: old_medalc_id).id
    end
    config['optional_basic_questions'].each do |key, old_medalc_id|
      config['optional_basic_questions'][key] = Node.find_by(old_medalc_id: old_medalc_id).id
    end
    project.update!(medal_r_config: config)
  end

  # Fix formula for new syntax
  Variable.set_callback(:validation, :before, :validate_formula)

  Node.where.not(formula: nil).each do |node|
    formula = node.formula
    formula = "{#{formula}}" if %w(ToDay ToMonth).include?(formula)
    formula.scan(/\[.*?\]/).each do |id|
      id.gsub!('[', '{').gsub!(']', '}') if id.include?('To')
      id = id.tr('ToDayMonth([{}])', '')
      formula.sub!(id, Node.find_by(old_medalc_id: id).id.to_s) if id.present?
    end
    node.update!(formula: formula)
  end
end

puts 'Seed finished'
