User.create(email: 'dev@wavemind.ch', password: '123456', password_confirmation: '123456')

data = JSON.parse(File.read(Rails.root.join('db/old_data.json')))
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

data['algorithms'].each do |algorithm|
  author = User.find_by(old_medalc_id: algorithm['user_id']) || User.first
  project = Project.create!(
    algorithm.slice('name', 'project', 'medal_r_config', 'village_json', 'consent_management', 'track_referral',
                    'emergency_content_version', 'emergency_content_translations')
             .merge(user: author)
  )

  algorithm['users'].each do |user|
    user = User.find_by(old_medalc_id: user['id'])
    project.users << user if user.present?
  end

  questions_to_rerun = []
  algorithm['questions'].each do |question|
    answer_type = AnswerType.find_or_create_by(
      display: question['answer_type']['display'],
      value: question['answer_type']['value']
    )
    new_question = Question.create!(
      question.slice('reference', 'label_translations', 'type', 'description_translations', 'is_neonat',
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
                old_medalc_id: question['id']
              )
    )
    questions_to_rerun.push({ hash: question, data: new_question }) if new_question.reference_table_male_name.present?

    question['answers'].each do |answer|
      new_question.answers.create!(answer.slice('reference', 'label_translations', 'operator', 'value', 'unavailable')
                                         .merge(old_medalc_id: answer['id']))
    end
  end

  questions_to_rerun.each do |entry|
    hash = entry[:hash]
    data = entry[:data]

    data.reference_table_x = Node.find_by(old_medalc_id: hash['reference_table_x_id'])
    data.reference_table_y = Node.find_by(old_medalc_id: hash['reference_table_y_id'])
    data.reference_table_z = Node.find_by(old_medalc_id: hash['reference_table_z_id'])
    data.save
  end

  qs_to_rerun = []
  algorithm['questions_sequences'].each do |qs|
    new_qs = project.nodes.create!(qs.slice('reference', 'label_translations', 'type', 'description_translations',
                                            'is_neonat', 'min_score', 'cut_off_start', 'cut_off_end')
                                     .merge(old_medalc_id: qs['id']))
    qs_to_rerun.push({ hash: qs, data: new_qs })

    qs['answers'].each do |answer|
      new_qs.answers.create!(answer.slice('reference', 'label_translations', 'operator', 'value', 'unavailable')
                                   .merge(old_medalc_id: answer['id']))
    end
  end

  instances_to_rerun = []
  qs_to_rerun.each do |entry|
    hash = entry[:hash]
    data = entry[:data]
    hash['components'].each do |instance|
      node = Node.find_by(old_medalc_id: instance['node_id'])
      new_instance = data.components.create!(node: node, old_medalc_id: instance['id'])
      instances_to_rerun.push({ hash: instance, data: new_instance})
    end
  end

  instances_to_rerun.each do |entry|
    hash = entry[:hash]
    data = entry[:data]
    hash['conditions'].each do |condition|
      answer = Answer.find_by(old_medalc_id: condition['answer_id'])
      next if answer.nil?
      data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer))
      parent_instance = data.components.find_by(node: answer.node)
      Child.create!(node: data.node, instance: parent_instance)
    end
  end

  algorithm['drugs'].each do |drug|
    new_drug = project.nodes.create!(drug.slice('reference', 'label_translations', 'type', 'description_translations',
                                                'is_neonat', 'is_danger_sign', 'is_anti_malarial', 'is_antibiotic',
                                                'level_of_urgency').merge(old_medalc_id: drug['id']))
    drug['formulations'].each do |formulation|
      administration_route = AdministrationRoute.find_or_create_by(
        formulation['administration_route'].slice('category', 'name_translations')
      )
      new_drug.formulations.create!(formulation.slice('minimal_dose_per_kg', 'maximal_dose_per_kg', 'maximal_dose',
                                                      'medication_form', 'dose_form', 'liquid_concentration',
                                                      'doses_per_day', 'unique_dose', 'breakable', 'by_age',
                                                      'description_translations', 'injection_instructions_translations',
                                                      'dispensing_description_translations')
                                               .merge(administration_route: administration_route))
    end
  end

  algorithm['managements'].each do |management|
    project.nodes.create!(management.slice('reference', 'label_translations', 'type', 'description_translations',
                                           'is_neonat', 'is_danger_sign', 'level_of_urgency')
                                    .merge(old_medalc_id: management['id']))
  end

  algorithm['versions'].each do |version|
    version_author = User.find_by(old_medalc_id: version['user_id']) || User.first
    new_algorithm = project.algorithms.create!(version.slice('name', 'medal_r_json', 'medal_r_json_version', 'job_id',
                                                         'description_translations', 'full_order_json', 'minimum_age',
                                                         'age_limit', 'age_limit_message_translations')
                                                  .merge(user: version_author))

    version['languages'].each do |language|
      language = Language.find_or_create_by(language.slice('name', 'code'))
      new_algorithm.algorithm_languages.create!(language: language)
    end

    version['medal_data_config_variables'].each do |variable|
      question = Node.find_by(old_medalc_id: variable['question_id'])
      new_algorithm.medal_data_config_variables.create!(variable.slice('label', 'api_key').merge(question: question))
    end

    instances_to_rerun = []
    version['components'].each do |instance|
      node = Node.find_by(old_medalc_id: instance['node_id'])
      new_instance = new_algorithm.components.create!(node: node, old_medalc_id: instance['id'])
      instances_to_rerun.push({ hash: instance, data: new_instance})
    end

    instances_to_rerun.each do |entry|
      hash = entry[:hash]
      data = entry[:data]
      hash['conditions'].each do |condition|
        answer = Answer.find_by(old_medalc_id: condition['answer_id'])
        next if answer.nil?
        data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
        parent_instance = data.components.find_by(node: answer.node)
        Child.create!(node: data.node, instance: parent_instance)
      end
    end

    version['diagnoses'].each do |diagnosis|
      cc = Node.find_by(old_medalc_id: diagnosis['node_id'])
      decision_tree = new_algorithm.decision_trees.create!(diagnosis.slice('reference', 'label_translations',
                                                                           'cut_off_start', 'cut_off_end')
                                                                    .merge(node: cc))
      diagnosis['final_diagnoses'].each do |final_diagnosis|
        project.nodes.create!(final_diagnosis.slice('reference', 'label_translations', 'description_translations',
                                                    'is_neonat', 'is_danger_sign', 'level_of_urgency')
                                             .merge(decision_tree: decision_tree, type: 'Diagnosis',
                                                    old_medalc_id: final_diagnosis['id']))
      end

      instances_to_rerun = []
      diagnosis['components'].each do |instance|
        node = Node.find_by(old_medalc_id: instance['node_id'])
        next if node.nil?
        new_instance = decision_tree.components.create!(node: node, old_medalc_id: instance['id'])
        instances_to_rerun.push({ hash: instance, data: new_instance})
      end

      instances_to_rerun.each do |entry|
        hash = entry[:hash]
        data = entry[:data]
        hash['conditions'].each do |condition|
          answer = Answer.find_by(old_medalc_id: condition['answer_id'])
          next if answer.nil?
          data.conditions.create!(condition.slice('cut_off_start', 'cut_off_end', 'score').merge(answer: answer))
          parent_instance = data.components.find_by(node: answer.node)
          Child.create!(node: data.node, instance: parent_instance)
        end
      end
    end
  end
end
