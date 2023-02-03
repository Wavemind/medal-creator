class VersionsService

  # @params id [Version] id of the algorithm version to extract
  # @return hash
  # Build a hash of an algorithm version with its diagnoses, predefined syndromes, questions and health cares and metadata
  def self.generate_version_hash(id)
    init
    @version = Version.find(id)
    @version.medal_r_json_version = @version.medal_r_json_version + 1
    @available_languages = @version.languages.map(&:code).unshift('en')

    @patient_questions = []

    hash = {}
    hash['diagnoses'] = {}

    # Loop in each diagnoses defined in current algorithm version
    @version.diagnoses.each do |diagnosis|
      @diagnoses_ids << diagnosis.id
      hash['diagnoses'][diagnosis.id] = extract_diagnosis(diagnosis)
    end

    hash = extract_version_metadata(hash)
    # Set all questions/drugs/managements used in this version of algorithm
    hash['nodes'] = generate_nodes

    hash['nodes'] = add_reference_links(hash['nodes'])
    hash['health_cares'] = generate_health_cares
    hash['final_diagnoses'] = @final_diagnoses

    hash['patient_level_questions'] = @patient_questions

    @version.medal_r_json = hash
    @version.save
  end

  # @params [Diagnosis]
  def self.generate_diagnosis_hash(diagnosis)
    init

    hash = extract_diagnosis_metadata(diagnosis)
    hash['diagnosis'] = extract_diagnosis(diagnosis)
    hash['nodes'] = generate_nodes
    hash
  end

  private

  def self.return_hstore_translated(field)
    return Hash[@available_languages.collect { |k| [k, ""] } ] if field.nil?
    field.select {|k,v| @available_languages.include?(k)}
  end

  def self.return_intern_label_translated(path)
    Hash[@available_languages.collect { |k| [k, I18n.t(path, locale: k)] } ]
  end

  # Fetch every nodes and add to vital sign where they are used in formula or reference tables
  def self.add_reference_links(nodes)
    nodes.map do |k, node|
      if node['formula'].present?
        node['formula'].scan(/\[.*?\]/).each do |id|
          id = id.tr('[]', '')

          # Remove temporary the function
          id = id.sub!('ToDay', '').tr('()', '') if id.include?('ToDay')
          id = id.sub!('ToMonth', '').tr('()', '') if id.include?('ToMonth')

          id = id.to_i

          nodes[id]['referenced_in'] = nodes[id]['referenced_in'].push(node['id']) unless nodes[id]['referenced_in'].include?(node['id'])
        end
      end

      if node['reference_table_x_id'].present?
        nodes[node['reference_table_x_id']]['referenced_in'] = nodes[node['reference_table_x_id']]['referenced_in'].push(node['id']) unless nodes[node['reference_table_x_id']]['referenced_in'].include?(node['id'])
        nodes[@version.algorithm.medal_r_config['basic_questions']['gender_question_id']]['referenced_in'] = nodes[@version.algorithm.medal_r_config['basic_questions']['gender_question_id']]['referenced_in'].push(node['id'])
      end

      if node['reference_table_y_id'].present?
        nodes[node['reference_table_y_id']]['referenced_in'] = nodes[node['reference_table_y_id']]['referenced_in'].push(node['id']) unless nodes[node['reference_table_y_id']]['referenced_in'].include?(node['id'])
      end

      if node['reference_table_z_id'].present?
        nodes[node['reference_table_z_id']]['referenced_in'] = nodes[node['reference_table_z_id']]['referenced_in'].push(node['id']) unless nodes[node['reference_table_z_id']]['referenced_in'].include?(node['id'])
      end
    end
    nodes
  end

  def self.init
    @questions = {}
    @health_cares = {}
    @questions_sequences = {}
    @final_diagnoses = {}

    # Get all qs and dd ids in order to build working diagnosis
    @diagnoses_ids = []
    @questions_sequences_ids = []
  end

  def self.generate_nodes
    hash = {}
    hash = hash.merge(generate_questions_sequences)
    hash.merge(generate_questions)
  end

  # @return hash
  # Build a hash of metadata about the algorithm and algorithm version
  def self.extract_diagnosis_metadata(diagnosis)
    hash = {}
    hash['id'] = diagnosis.id
    hash
  end

  # @return hash
  # Build a hash of metadata about the algorithm and algorithm version
  def self.extract_version_metadata(hash)
    hash['version_id'] = @version.id
    hash['version_name'] = @version.name
    hash['version_languages'] = @available_languages
    hash['json_version'] = @version.medal_r_json_version
    hash['description'] = return_hstore_translated(@version.description_translations)
    hash['algorithm_id'] = @version.algorithm.id
    hash['algorithm_name'] = @version.algorithm.name
    hash['diagram'] = extract_version_diagram
    hash['is_arm_control'] = @version.is_arm_control
    hash['village_json'] = @version.algorithm.village_json
    hash['study'] = {
      id: @version.algorithm.study.present? ? @version.algorithm.study.id : nil,
      label: @version.algorithm.study.present? ? @version.algorithm.study.label : nil,
      default_language: @version.algorithm.study.present? ? @version.algorithm.study.default_language : nil,
      description: @version.algorithm.study.present? ? return_hstore_translated(@version.algorithm.study.description_translations) : nil
    }

    hash['config'] = @version.algorithm.medal_r_config

    translated_systems = {}
    Question.systems.map(&:first).map do |system|
      translated_systems[system] = return_intern_label_translated("questions.systems.#{system}")
    end
    hash['config']['systems_translations'] = translated_systems
    hash['config']['age_limit'] = @version.age_limit
    hash['config']['age_limit_message'] = return_hstore_translated(@version.age_limit_message_translations)
    hash['config']['minimum_age'] = @version.minimum_age
    hash['config']['consent_management'] = @version.algorithm.consent_management
    hash['config']['track_referral'] = @version.algorithm.track_referral
    hash['config']['full_order'] = extract_full_order_json
    hash['config']['birth_date_formulas'] = @questions.values.select{|q| %w(ToDay ToMonth).include?(q.formula)}.map(&:id)

    hash['author'] = @version.user.full_name
    hash['created_at'] = @version.created_at
    hash['updated_at'] = DateTime.now
    hash
  end

  def self.extract_full_order_json
    full_order = JSON.parse(@version.full_order_json)
    available_ids = @questions.keys # Get all node ids
    available_ids.push('birth_date', 'first_name', 'last_name') # Include the 3 hardcoded questions so it passes through

    hash = {}
    Question.steps.each do |step_name, step_index|
      hash[step_name] = []
      if %w(medical_history_step physical_exam_step).include?(step_name)
        full_order[step_index]['children'].each do |system|
          system_hash = {}
          system_hash['title'] = system['subtitle_name']
          system_hash['data'] = system['children'].map{|node| node['id'] if available_ids.include?(node['id'])}.compact
          hash[step_name].push(system_hash)
        end
      elsif step_name == 'complaint_categories_step'
        hash[step_name] = {}
        hash[step_name]['older'] = full_order[step_index]['children'][0]['children'].map{|node| node['id'] if available_ids.include?(node['id'])}.compact
        hash[step_name]['neonat'] = full_order[step_index]['children'][1]['children'].map{|node| node['id'] if available_ids.include?(node['id'])}.compact
      else
        hash[step_name] = full_order.select{|i| i['title'] == I18n.t("questions.steps.#{step_name}")}[0]['children'].map{|node| node['id'] if available_ids.include?(node['id'])}.compact
      end
    end
    hash
  end

  # @params object [Diagnosis]
  # @return hash
  # Set metadata of diagnosis and it's condition for differential diagnosis
  def self.extract_diagnosis(diagnosis)
    hash = {}
    hash['id'] = diagnosis.id
    hash['label'] = return_hstore_translated(diagnosis.label_translations)
    hash['complaint_category'] = diagnosis.node_id
    hash['cut_off_start'] = diagnosis.cut_off_start
    hash['cut_off_end'] = diagnosis.cut_off_end
    hash['instances'] = {}
    hash['final_diagnoses'] = {}

    # Loop in each final diagnoses for set conditional acceptance and health cares related to it
    diagnosis.components.final_diagnoses.includes(:node).each do |final_diagnosis_instance|
      final_diagnosis_hash = extract_final_diagnosis(final_diagnosis_instance)
      @final_diagnoses[final_diagnosis_instance.node.id] = final_diagnosis_hash
      hash['final_diagnoses'][final_diagnosis_instance.node_id] = {}
      hash['final_diagnoses'][final_diagnosis_instance.node_id]['id'] = final_diagnosis_instance.node_id
      hash['final_diagnoses'][final_diagnosis_instance.node_id]['instances'] = {}
    end

    # Loop in each question used in current diagnosis
    diagnosis.components.questions.includes([:children, :nodes, node:[:answers, :answer_type]]).each do |question_instance|
      # Append the questions in order to list them all at the end of the json.
      assign_node(question_instance.node)

      hash['instances'][question_instance.node_id] = extract_instances(question_instance) if hash['instances'][question_instance.node_id].nil? || question_instance.final_diagnosis_id.nil?
      hash['final_diagnoses'][question_instance.final_diagnosis_id]['instances'][question_instance.node.id] = extract_instances(question_instance) unless question_instance.final_diagnosis_id.nil?
    end

    # Loop in each predefined syndromes used in current diagnosis
    diagnosis.components.questions_sequences.includes([:children, :nodes, node:[:answers]]).each do |questions_sequence_instance|
      # Append the predefined syndromes in order to list them all at the end of the json.
      assign_node(questions_sequence_instance.node)

      hash['instances'][questions_sequence_instance.node.id] = extract_instances(questions_sequence_instance) if hash['instances'][questions_sequence_instance.node.id].nil? || questions_sequence_instance.final_diagnosis_id.nil?
      hash['final_diagnoses'][questions_sequence_instance.final_diagnosis_id]['instances'][questions_sequence_instance.node.id] = extract_instances(questions_sequence_instance) unless questions_sequence_instance.final_diagnosis_id.nil?
    end

    hash
  end

  # @return hash
  # Set diagram logic of the version
  def self.extract_version_diagram
    hash = {}
    hash['instances'] = {}

    @version.components.includes(:node).each do |instance|
      assign_node(instance.node)
      hash['instances'][instance.node_id] = extract_instances(instance)
    end

    hash
  end

  # @params object [Instance]
  # @return hash
  # Set metadata of a final diagnosis
  def self.extract_final_diagnosis(instance)
    final_diagnosis = instance.node
    hash = extract_conditions(instance.conditions)
    hash['diagnosis_id'] = final_diagnosis.diagnosis.id
    hash['id'] = final_diagnosis.id
    hash['reference'] = final_diagnosis.reference
    hash['label'] = return_hstore_translated(final_diagnosis.label_translations)
    hash['description'] = return_hstore_translated(final_diagnosis.description_translations)
    hash['level_of_urgency'] = final_diagnosis.level_of_urgency
    hash['medias'] = extract_medias(final_diagnosis)
    hash['type'] = final_diagnosis.node_type
    hash['drugs'] = extract_health_cares(final_diagnosis.components.drugs.map(&:node), instance.instanceable.id, final_diagnosis.id)
    hash['managements'] = extract_health_cares(final_diagnosis.components.managements.map(&:node), instance.instanceable.id, final_diagnosis.id)
    # Don't mention any exclusions if the version is arm control. Hopefully this is temporary...
    hash['excluding_final_diagnoses'] = @version.is_arm_control ? [] : final_diagnosis.excluding_nodes_ids
    hash['cc'] = final_diagnosis.diagnosis.node_id
    hash
  end

  # @params object [Instance]
  # @return hash
  # Set children and condition for current node
  def self.extract_instances(instance)
    hash = extract_conditions(instance.conditions)
    hash['id'] = instance.node.id
    hash['children'] = instance.nodes.collect(&:id)
    hash['final_diagnosis_id'] = instance.final_diagnosis_id
    hash
  end

  # @params array [Conditions]
  # @return hash
  # Return hash of top conditions and conditions
  def self.extract_conditions(conditions)
    hash = {}
    hash['conditions'] = []

    if conditions.present?
      conditions.includes([:answer]).each do |condition|
        hash['conditions'] << push_condition(condition)
      end

    end
    hash
  end

  # @params hash [Condition]
  # @return hash
  # Set metadata for condition
  def self.push_condition(condition)
    hash = {}
    hash['answer_id'] = condition.answer_id
    hash['node_id'] = condition.answer.node.id

    hash['cut_off_start'] = condition.cut_off_start unless condition.cut_off_start.nil?
    hash['cut_off_end'] = condition.cut_off_end unless condition.cut_off_end.nil?
    hash['score'] = condition.score unless condition.score.nil?
    hash
  end

  # @params activerecord collection [Drug, Management]
  # @params [Integer] id of current diagnosis
  # @return hash
  # Set metadata for drugs and managements (health cares)
  def self.extract_health_cares(health_cares, diagnosis_id, final_diagnosis_id)
    hash = {}
    health_cares.each do |health_care|

      instance = health_care.instances.find_by(instanceable_id: diagnosis_id, final_diagnosis_id: final_diagnosis_id)
      hash[health_care.id] = extract_conditions(instance.conditions)
      hash[health_care.id]['id'] = health_care.id
      hash[health_care.id]['is_pre_referral'] = instance.is_pre_referral
      hash[health_care.id]['duration'] = return_hstore_translated(instance.duration_translations) if instance.node.is_a?(HealthCares::Drug)
      # Get instance description for drugs and node descriptions for management
      hash[health_care.id]['description'] = instance.node.is_a?(HealthCares::Drug) ? return_hstore_translated(instance.description_translations) : return_hstore_translated(instance.node.description_translations)

      # Append the health care in order to list them all at the end of the json.
      assign_node(health_care)
    end
    hash
  end

  # @params object [Node]
  # Push the current node in the appropriate hash if it doesn't exist
  def self.assign_node(node)
    case node.node_type
    when 'Question'
      @questions[node.id] = node if @questions[node.id].nil?
    when 'HealthCare'
      @health_cares[node.id] = node if @health_cares[node.id].nil?
    when 'QuestionsSequence'
      @questions_sequences_ids << node.id
      @questions_sequences[node.id] = node if @questions_sequences[node.id].nil?

      # Recursive nodes on PS
      Instance.where(instanceable: node).each do |instance|
        assign_node(instance.node) unless instance.node == node
      end
    else
      raise "The given node's type #{node.node_type} (#{node.reference}) is not handled."
    end
  end

  # @return hash
  # Generate all questions with its answers
  def self.generate_questions
    hash = {}
    @questions.each do |key, question|
      hash[question.id] = {}
      hash[question.id]['id'] = question.id
      hash[question.id]['type'] = question.node_type
      hash[question.id]['label'] = return_hstore_translated(question.label_translations)
      hash[question.id]['description'] = return_hstore_translated(question.description_translations)
      hash[question.id]['placeholder'] = return_hstore_translated(question.placeholder_translations)
      hash[question.id]['is_mandatory'] = (@version.is_arm_control && !%w(Questions::BasicDemographic Questions::Demographic Questions::Referral).include?(question.type)) ? false : question.is_mandatory
      hash[question.id]['is_neonat'] = question.is_neonat
      hash[question.id]['is_pre_fill'] = question.is_pre_fill
      hash[question.id]['system'] = question.system unless question.system.nil?
      hash[question.id] = format_formula(hash[question.id], question)

      # Emergency status logic
      if question.emergency_status && question.emergency_status.include?('emergency')
        hash[question.id]['emergency_status'] = 'emergency'
        reference = question.emergency_status == 'emergency' ? 1 : 2
        hash[question.id]['emergency_answer_id'] = question.answers.find_by(reference: reference).id
      else
        hash[question.id]['emergency_status'] = question.emergency_status
      end

      hash[question.id]['category'] = question.category_name
      hash[question.id]['round'] = I18n.t("questions.rounds.#{question.round}.value").to_f unless question.round.nil?
      hash[question.id]['is_identifiable'] = question.is_identifiable
      hash[question.id]['is_danger_sign'] = question.is_danger_sign
      hash[question.id]['unavailable'] = question.unavailable
      hash[question.id]['unavailable_label'] = (question.is_a?(Questions::VitalSignAnthropometric) || question.is_a?(Questions::BasicMeasurement)) ? return_intern_label_translated('answers.unfeasible') : {}
      hash[question.id]['estimable'] = question.estimable unless question.estimable.nil?
      # Send Reference instead of actual display format to help f-e interpret the question correctly
      hash[question.id]['value_format'] = question.answer_type.value
      format = question.answer_type.display
      format = 'Reference' if question.reference_table_x_id.present?
      format = question.answer_type.value if %w(Date String).include?(question.answer_type.value)
      format = 'Autocomplete' if question.algorithm.medal_r_config["optional_basic_questions"]["village_question_id"] === question.id
      hash[question.id]['display_format'] = format
      hash[question.id]['qs'] = get_node_questions_sequences(question, []).uniq
      hash[question.id]['dd'] = get_node_diagnoses(question, []).uniq
      hash[question.id]['df'] = get_node_final_diagnoses(question).uniq
      hash[question.id]['conditioned_by_cc'] = question.is_a?(Questions::ComplaintCategory) ? [] : question.complaint_categories.map(&:id)
      hash[question.id]['referenced_in'] = []
      hash[question.id]['answers'] = {}

      unless question.reference_table_x_id.nil?
        hash[question.id]['reference_table_x_id'] = question.reference_table_x_id
        hash[question.id]['reference_table_y_id'] = question.reference_table_y_id
        hash[question.id]['reference_table_z_id'] = question.reference_table_z_id
        hash[question.id]['reference_table_male'] = question.reference_table_male
        hash[question.id]['reference_table_female'] = question.reference_table_female
      end

      unless question.min_value_warning.nil?
        hash[question.id]['min_value_warning'] = question.min_value_warning
        hash[question.id]['min_message_warning'] = return_hstore_translated(question.min_message_warning_translations)
      end

      unless question.max_value_warning.nil?
        hash[question.id]['max_value_warning'] = question.max_value_warning
        hash[question.id]['max_message_warning'] = return_hstore_translated(question.max_message_warning_translations)
      end

      unless question.min_value_error.nil?
        hash[question.id]['min_value_error'] = question.min_value_error
        hash[question.id]['min_message_error'] = return_hstore_translated(question.min_message_error_translations)
      end

      unless question.max_value_error.nil?
        hash[question.id]['max_value_error'] = question.max_value_error
        hash[question.id]['max_message_error'] = return_hstore_translated(question.max_message_error_translations)
      end

      if question.is_a?(Questions::ComplaintCategory)
        hash[question.id]['questions_related_to_cc'] = get_complaint_category_questions(question)
        hash[question.id]['questions_sequences_related_to_cc'] = get_complaint_category_questions_sequences(question)
        hash[question.id]['diagnoses_related_to_cc'] = get_complaint_category_diagnoses(question, [])
      end

      hash[question.id]['medias'] = extract_medias(question)

      question.answers.each do |answer|
        answer_hash = {}
        answer_hash['id'] = answer.id
        answer_hash['reference'] = answer.reference
        answer_hash['label'] = return_hstore_translated(answer.label_translations)
        answer_hash['value'] = answer.value
        answer_hash['operator'] = answer.operator

        hash[question.id]['answers'][answer.id] = answer_hash
      end

      # Push the patient level questions in an array for medAL-reader to read it easily
      @patient_questions.push(question.id) if %w(Questions::BasicDemographic Questions::Demographic Questions::ChronicalCondition Questions::Vaccine).include?(question.type)
    end
    hash
  end

  # @params [Node]
  # @return [Array]
  # Get all medias for a node and put it in a hash
  def self.extract_medias(node)
    medias = []
    node.medias.map do |media|
      hash = {}
      hash['label'] = return_hstore_translated(media.label_translations)
      hash['url'] = media.url.url
      hash['extension'] = media.url.file.extension.downcase
      medias.push(hash)
    end
    medias
  end

  # @params [String]
  # @return [String]
  # Format a formula in order to replace references by ids
  def self.format_formula(hash, question)
    hash['vital_signs'] = []
    formula = question.formula
    return hash if formula.nil?

    vital_signs = []
    formula.scan(/\[.*?\]/).each do |reference|
      reference = reference.tr('[]', '')

      # Remove temporary the function
      reference = reference.sub!('ToDay', '').tr('()', '') if reference.include?('ToDay')
      reference = reference.sub!('ToMonth', '').tr('()', '') if reference.include?('ToMonth')

      prefix_type, db_reference = reference.match(/([A-Z]*)([0-9]*)/i).captures
      type = Question.get_type_from_prefix(prefix_type)
      if type.present?
        question = @version.algorithm.questions.find_by(type: type, reference: db_reference)
        vital_signs.push(question.id) if question.is_a? Questions::VitalSignAnthropometric
        formula.sub!(reference, question.id.to_s)
      end
    end
    hash['formula'] = formula
    hash['vital_signs'] = vital_signs
    hash
  end

  # @params [Node, Array]
  # @return [Array]
  # Recursive method in order to retrieve every diagnoses the question appears in.
  def self.get_complaint_category_diagnoses(node, diagnoses)
    node.diagnoses.each do |diagnosis|
      if @diagnoses_ids.include?(diagnosis.id) && !diagnoses.include?(diagnosis.id)
        diagnoses << diagnosis.id
      end
    end
    diagnoses
  end

  # @params [Node]
  # @return [Array]
  # Return all questions conditioned by given complaint category
  def self.get_complaint_category_questions(cc)
    NodeComplaintCategory.where(complaint_category: cc).map(&:node).select{|n| n.is_a?(Question)}.map(&:id)
  end

  # @params [Node]
  # @return [Array]
  # Return all questions sequences conditioned by given complaint category
  def self.get_complaint_category_questions_sequences(cc)
    NodeComplaintCategory.where(complaint_category: cc).map(&:node).select{|n| n.is_a?(QuestionsSequence)}.map(&:id)
  end

  # @params [Node, Array]
  # @return [Array]
  # Recursive method in order to retrieve every diagnoses the question appears in.
  def self.get_node_diagnoses(node, diagnoses)
    node.instances.map(&:instanceable).each do |instanceable|
      unless instanceable == node
        if instanceable.is_a? Diagnosis
          # push the id in the array only if it is not already there and if it is handled by the current algorithm version
          if @diagnoses_ids.include?(instanceable.id) && !diagnoses.include?(instanceable.id)
            diagnoses.push(instanceable.id)
          end
        end
      end
    end
    diagnoses
  end

  # @params [Node, Array]
  # @return [Array]
  # Recursive method in order to retrieve every final_diagnoses the question appears in.
  def self.get_node_final_diagnoses(node)
    final_diagnoses = []
    node.instances.each do |instance|
      df = instance.final_diagnosis_id
      if df.present? && @final_diagnoses[df].present?
        final_diagnoses.push(df)
      end
    end
    final_diagnoses.uniq
  end

  # @params [Node, Array]
  # @return [Array]
  # Recursive method in order to retrieve every predefined syndromes the question appears in.
  def self.get_node_questions_sequences(node, questions_sequences)
    node.instances.map(&:instanceable).each do |instanceable|
      unless instanceable == node
        if instanceable.is_a?(Node)
          # push the id in the array only if it is not already there and if it is handled by the current algorithm version
          if @questions_sequences_ids.include?(instanceable.id) && !questions_sequences.include?(instanceable.id)
            questions_sequences.push(instanceable.id)
          end
        end
      end
    end
    questions_sequences
  end

  # @return hash
  # Generate all health cares
  def self.generate_health_cares
    hash = {}
    @health_cares.each do |key, health_care|
      hash[health_care.id] = {}
      hash[health_care.id]['id'] = health_care.id
      hash[health_care.id]['category'] = health_care.category_name
      hash[health_care.id]['is_anti_malarial'] = health_care.is_anti_malarial
      hash[health_care.id]['is_antibiotic'] = health_care.is_antibiotic
      hash[health_care.id]['label'] = return_hstore_translated(health_care.label_translations)
      hash[health_care.id]['description'] = return_hstore_translated(health_care.description_translations)
      hash[health_care.id]['level_of_urgency'] = health_care.level_of_urgency
      # Don't mention any exclusions if the version is arm control. Hopefully this is temporary...
      hash[health_care.id]['excluding_nodes_ids'] = @version.is_arm_control ? [] : health_care.excluding_nodes_ids
      # Fields specific to drugs
      if health_care.is_a?(HealthCares::Drug)
        hash[health_care.id]['formulations'] = []
        health_care.formulations.map do |formulation|
          formulation_hash = {}
          formulation_hash['']
          formulation_hash['id'] = formulation.id
          formulation_hash['medication_form'] = formulation.medication_form
          formulation_hash['administration_route_category'] = formulation.administration_route.category
          formulation_hash['administration_route_name'] = formulation.administration_route.name
          formulation_hash['liquid_concentration'] = formulation.liquid_concentration
          formulation_hash['dose_form'] = formulation.dose_form
          formulation_hash['unique_dose'] = formulation.unique_dose
          formulation_hash['by_age'] = formulation.by_age
          formulation_hash['breakable'] = formulation.breakable.present? ? I18n.t("formulations.breakables.#{formulation.breakable}.value") : nil
          formulation_hash['minimal_dose_per_kg'] = formulation.minimal_dose_per_kg
          formulation_hash['maximal_dose_per_kg'] = formulation.maximal_dose_per_kg
          formulation_hash['maximal_dose'] = formulation.maximal_dose
          formulation_hash['doses_per_day'] = formulation.doses_per_day
          formulation_hash['description'] = return_hstore_translated(formulation.description_translations)
          formulation_hash['injection_instructions'] = return_hstore_translated(formulation.injection_instructions_translations)
          formulation_hash['dispensing_description'] = return_hstore_translated(formulation.dispensing_description_translations)
          hash[health_care.id]['formulations'].push(formulation_hash)
        end
      else
        hash[health_care.id]['is_referral'] = health_care.is_referral
        hash[health_care.id]['medias'] = extract_medias(health_care)
      end
    end
    hash
  end

  # @return hash
  # Generate all predefined syndromes with its answers and conditions related
  def self.generate_questions_sequences
    hash = {}
    @questions_sequences.each do |key, questions_sequence|
      hash[questions_sequence.id] = extract_conditions(questions_sequence.instances.find_by(instanceable_id: questions_sequence.id).conditions)
      hash[questions_sequence.id]['id'] = questions_sequence.id
      hash[questions_sequence.id]['label'] = return_hstore_translated(questions_sequence.label_translations)
      hash[questions_sequence.id]['min_score'] = questions_sequence.min_score unless questions_sequence.min_score.nil?
      hash[questions_sequence.id]['type'] = questions_sequence.node_type
      hash[questions_sequence.id]['category'] = questions_sequence.category_name
      hash[questions_sequence.id]['cut_off_start'] = questions_sequence.cut_off_start
      hash[questions_sequence.id]['cut_off_end'] = questions_sequence.cut_off_end
      hash[questions_sequence.id]['instances'] = {}
      hash[questions_sequence.id]['answers'] = push_questions_sequence_answers(questions_sequence)
      hash[questions_sequence.id]['qs'] = get_node_questions_sequences(questions_sequence, [])
      hash[questions_sequence.id]['dd'] = get_node_diagnoses(questions_sequence, [])
      hash[questions_sequence.id]['df'] = get_node_final_diagnoses(questions_sequence)
      hash[questions_sequence.id]['conditioned_by_cc'] = questions_sequence.complaint_categories.map(&:id)
      hash[questions_sequence.id]['answer'] = nil
      hash[questions_sequence.id]['value_format'] = 'Boolean'

      # Loop in each instance for defined condition
      questions_sequence.components.questions.includes(:conditions, :children, :nodes, node:[:answer_type, :answers]).each do |instance|
        # assign_node(instance.node)
        hash[questions_sequence.id]['instances'][instance.node.id] = extract_instances(instance)
      end

      questions_sequence.components.questions_sequences.includes(:conditions, :children, :nodes).each do |instance|
        hash[questions_sequence.id]['instances'][instance.node.id] = extract_instances(instance) unless questions_sequence == instance.node
      end
    end
    hash
  end

  # Loop in each output possibilities(answer) for defined predefined syndrome
  def self.push_questions_sequence_answers(questions_sequence)
    hash = {}
    questions_sequence.answers.each do |answer|
      answer_hash = {}
      answer_hash['id'] = answer.id
      answer_hash['label'] = answer.label
      answer_hash['reference'] = answer.reference

      hash[answer.id] = answer_hash
    end
    hash
  end
end
