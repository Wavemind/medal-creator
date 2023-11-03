include Rails.application.routes.url_helpers
class AlgorithmsService

  # @params id [Version] id of the algorithm version to extract
  # @return hash
  # Build a hash of an algorithm version with its diagnoses, predefined syndromes, questions and health cares and metadata
  def self.generate_algorithm_hash(id)
    init
    @algorithm = Algorithm.find(id)
    @project = @algorithm.project
    @algorithm.medal_r_json_version = @algorithm.medal_r_json_version + 1
    @available_languages = @algorithm.languages.map(&:code).unshift('en')

    @patient_questions = []

    hash = {}
    hash['diagnoses'] = {}

    # Loop in each diagnoses defined in current algorithm version
    @algorithm.decision_trees.each do |decision_tree|
      @decision_trees_ids << decision_tree.id
      hash['diagnoses'][decision_tree.id] = extract_decision_tree(decision_tree)
    end

    hash = extract_algorithm_metadata(hash)
    # Set all questions/drugs/managements used in this version of algorithm
    hash['nodes'] = generate_nodes

    hash['nodes'] = add_reference_links(hash['nodes'])
    hash['health_cares'] = generate_health_cares
    hash['final_diagnoses'] = @diagnoses

    hash['patient_level_questions'] = @patient_questions

    @algorithm.medal_r_json = hash
    @algorithm.save
  end

  # @params [Diagnosis]
  def self.generate_diagnosis_hash(diagnosis)
    init

    hash = extract_decision_tree_metadata(diagnosis)
    hash['diagnosis'] = extract_decision_tree(diagnosis)
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
        nodes[@project.medal_r_config['basic_questions']['gender_question_id']]['referenced_in'] = nodes[@project.medal_r_config['basic_questions']['gender_question_id']]['referenced_in'].push(node['id'])
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
    @variables = {}
    @health_cares = {}
    @questions_sequences = {}
    @diagnoses = {}

    # Get all qs and dd ids in order to build working diagnosis
    @decision_trees_ids = []
    @questions_sequences_ids = []
  end

  def self.generate_nodes
    hash = {}
    hash = hash.merge(generate_questions_sequences)
    hash.merge(generate_questions)
  end

  # @return hash
  # Build a hash of metadata about the algorithm and algorithm version
  def self.extract_decision_tree_metadata(decision_tree)
    hash = {}
    hash['id'] = decision_tree.id
    hash
  end

  # @return hash
  # Build a hash of metadata about the algorithm and algorithm version
  def self.extract_algorithm_metadata(hash)

    hash['version_id'] = @algorithm.id
    hash['version_name'] = @algorithm.name
    hash['version_languages'] = @available_languages
    hash['json_version'] = @algorithm.medal_r_json_version
    hash['description'] = return_hstore_translated(@algorithm.description_translations)
    hash['algorithm_id'] = @project.id
    hash['algorithm_name'] = @project.name
    hash['diagram'] = extract_project_diagram
    hash['is_arm_control'] = @algorithm.arm_control?
    hash['village_json'] = @project.village_json
    hash['study'] = {
      id: @project.id,
      label: @project.name,
      default_language: @project.language.code,
      description: @project.study_description_translations
    }

    hash['config'] = @project.medal_r_config

    translated_systems = {}
    Variable.systems.map(&:first).map do |system|
      translated_systems[system] = return_intern_label_translated("variables.systems.#{system}")
    end

    hash['config']['systems_translations'] = translated_systems
    hash['config']['age_limit'] = @algorithm.age_limit
    hash['config']['age_limit_message'] = return_hstore_translated(@algorithm.age_limit_message_translations)
    hash['config']['minimum_age'] = @algorithm.minimum_age
    hash['config']['consent_management'] = @project.consent_management
    hash['config']['track_referral'] = @project.track_referral
    hash['config']['full_order'] = extract_full_order_json
    hash['config']['birth_date_formulas'] = @variables.values.select{|q| %w(ToDay ToMonth).include?(q.formula)}.map(&:id)

    # TODO used key ?
    hash['author'] = User.first.full_name
    hash['created_at'] = @algorithm.created_at
    hash['updated_at'] = DateTime.now
    hash
  end

  # Extract order
  def self.extract_full_order_json
    full_order = JSON.parse(@algorithm.full_order_json)
    available_ids = @variables.keys # Get all node ids
    available_ids.push('birth_date', 'first_name', 'last_name') # Include the 3 hardcoded questions so it passes through

    hash = {}

    full_order.each do |node|
      if node['id'].is_a?(Integer)
        if node['parent'].include?('step_') # Child of a system
          step, system = node['parent'].split('step_')
          step = "#{step}_step"
          hash[step] ||= []
          system_hash = hash[step].find{|system_key| system_key['title'] == system}
          unless system_hash.present?
            system_hash = {"title" => system, "data" => []}
            hash[step].push(system_hash)
          end
          system_hash['data'].push(node['id'])
        elsif node['parent'].include?('_children') # Child of a complaint category
          hash['complaint_categories_step'] ||= {}
          hash['complaint_categories_step'][node['parent'].split('_')[0]] ||= []
          hash['complaint_categories_step'][node['parent'].split('_')[0]].push(node['id'])
        else # Child of a direct step
          hash[node['parent']] ||= []
          hash[node['parent']].push(node['id'])
        end
      elsif %w[first_name last_name birth_date].include?(node['id'])
        hash['registration_step'] ||= []
        hash['registration_step'].push(node['id'])
      end
    end

    hash
  end

  # @params object [Diagnosis]
  # @return hash
  # Set metadata of diagnosis and it's condition for differential diagnosis
  def self.extract_decision_tree(decision_tree)
    hash = {}
    hash['id'] = decision_tree.id
    hash['label'] = return_hstore_translated(decision_tree.label_translations)
    hash['complaint_category'] = decision_tree.node_id
    hash['cut_off_start'] = decision_tree.cut_off_start
    hash['cut_off_end'] = decision_tree.cut_off_end
    hash['instances'] = {}
    hash['final_diagnoses'] = {}

    # Loop in each final diagnoses for set conditional acceptance and health cares related to it
    decision_tree.components.diagnoses.includes(:node).each do |diagnosis_instance|
      @diagnoses[diagnosis_instance.node.id] = extract_diagnosis(diagnosis_instance)
      hash['final_diagnoses'][diagnosis_instance.node_id] = {}
      hash['final_diagnoses'][diagnosis_instance.node_id]['id'] = diagnosis_instance.node_id
      hash['final_diagnoses'][diagnosis_instance.node_id]['instances'] = {}
    end

    # Loop in each question used in current diagnosis
    decision_tree.components.variables.includes([:children, :nodes, node:[:answers, :answer_type]]).each do |variable_instance|
      # Append the questions in order to list them all at the end of the json.
      assign_node(variable_instance.node)

      hash['instances'][variable_instance.node_id] = extract_instances(variable_instance) if hash['instances'][variable_instance.node_id].nil? || variable_instance.diagnosis_id.nil?
      hash['final_diagnoses'][variable_instance.diagnosis_id]['instances'][variable_instance.node.id] = extract_instances(variable_instance) unless variable_instance.diagnosis_id.nil?
    end

    # Loop in each predefined syndromes used in current diagnosis
    decision_tree.components.questions_sequences.includes([:children, :nodes, node:[:answers]]).each do |questions_sequence_instance|
      # Append the predefined syndromes in order to list them all at the end of the json.
      assign_node(questions_sequence_instance.node)

      hash['instances'][questions_sequence_instance.node.id] = extract_instances(questions_sequence_instance) if hash['instances'][questions_sequence_instance.node.id].nil? || questions_sequence_instance.diagnosis_id.nil?
      hash['final_diagnoses'][questions_sequence_instance.diagnosis_id]['instances'][questions_sequence_instance.node.id] = extract_instances(questions_sequence_instance) unless questions_sequence_instance.diagnosis_id.nil?
    end

    hash
  end

  # @return hash
  # Set diagram logic of the version
  def self.extract_project_diagram
    hash = {}
    hash['instances'] = {}

    @algorithm.components.includes(:node).each do |instance|
      assign_node(instance.node)
      hash['instances'][instance.node_id] = extract_instances(instance)
    end

    hash
  end

  # @params object [Instance]
  # @return hash
  # Set metadata of a final diagnosis
  def self.extract_diagnosis(instance)
    diagnosis = instance.node
    hash = extract_conditions(instance.conditions)
    hash['diagnosis_id'] = diagnosis.decision_tree_id
    hash['id'] = diagnosis.id
    hash['label'] = return_hstore_translated(diagnosis.label_translations)
    hash['description'] = return_hstore_translated(diagnosis.description_translations)
    hash['level_of_urgency'] = diagnosis.level_of_urgency
    hash['medias'] = extract_medias(diagnosis)
    hash['type'] = diagnosis.node_type
    hash['drugs'] = extract_health_cares(diagnosis.components.drugs.map(&:node), instance.instanceable.id, diagnosis.id)
    hash['managements'] = extract_health_cares(diagnosis.components.managements.map(&:node), instance.instanceable.id, diagnosis.id)
    # Don't mention any exclusions if the version is arm control. Hopefully this is temporary...
    hash['excluding_final_diagnoses'] = @algorithm.arm_control? ? [] : diagnosis.excluding_node_ids
    hash['cc'] = diagnosis.decision_tree.node_id
    hash
  end

  # @params object [Instance]
  # @return hash
  # Set children and condition for current node
  def self.extract_instances(instance)
    hash = extract_conditions(instance.conditions)
    hash['id'] = instance.node.id
    hash['children'] = instance.nodes.collect(&:id)
    hash['final_diagnosis_id'] = instance.diagnosis_id
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
  def self.extract_health_cares(health_cares, decision_tree_id, diagnosis_id)
    hash = {}
    health_cares.each do |health_care|

      instance = health_care.instances.find_by(instanceable_id: decision_tree_id, instanceable_type: 'DecisionTree', diagnosis_id: diagnosis_id)
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
    when 'Variable'
      @variables[node.id] = node if @variables[node.id].nil?
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
    @variables.each do |key, variable|
      hash[variable.id] = {}
      hash[variable.id]['id'] = variable.id
      hash[variable.id]['type'] = variable.node_type
      hash[variable.id]['label'] = return_hstore_translated(variable.label_translations)
      hash[variable.id]['description'] = return_hstore_translated(variable.description_translations)
      hash[variable.id]['placeholder'] = return_hstore_translated(variable.placeholder_translations)
      hash[variable.id]['is_mandatory'] = (@algorithm.arm_control? && !%w(Variables::BasicDemographic Variables::Demographic Variables::Referral).include?(variable.type)) ? false : variable.is_mandatory
      hash[variable.id]['is_neonat'] = variable.is_neonat
      hash[variable.id]['is_pre_fill'] = variable.is_pre_fill
      hash[variable.id]['system'] = variable.system unless variable.system.nil?
      hash[variable.id] = format_formula(hash[variable.id], variable)

      # Emergency status logic
      if variable.emergency_status && variable.emergency_status.include?('emergency')
        hash[variable.id]['emergency_status'] = 'emergency'
        reference = variable.emergency_status == 'emergency' ? 1 : 2
        hash[variable.id]['emergency_answer_id'] = variable.answers.find_by(reference: reference).id
      else
        hash[variable.id]['emergency_status'] = variable.emergency_status
      end

      hash[variable.id]['category'] = variable.category_name
      hash[variable.id]['round'] = I18n.t("questions.rounds.#{variable.round}.value").to_f unless variable.round.nil?
      hash[variable.id]['is_identifiable'] = variable.is_identifiable
      hash[variable.id]['is_danger_sign'] = variable.is_danger_sign
      hash[variable.id]['unavailable'] = variable.is_unavailable
      hash[variable.id]['unavailable_label'] = (variable.is_a?(Variables::VitalSignAnthropometric) || variable.is_a?(Variables::BasicMeasurement)) ? return_intern_label_translated('answers.unfeasible') : {}
      hash[variable.id]['estimable'] = variable.is_estimable unless variable.is_estimable.nil?
      # Send Reference instead of actual display format to help f-e interpret the question correctly
      hash[variable.id]['value_format'] = variable.answer_type.value
      format = variable.answer_type.display
      format = 'Reference' if variable.reference_table_x_id.present?
      format = variable.answer_type.value if %w(Date String).include?(variable.answer_type.value)
      format = 'Autocomplete' if variable.project.medal_r_config["optional_basic_questions"]["village_question_id"] === variable.id
      hash[variable.id]['display_format'] = format
      hash[variable.id]['qs'] = get_node_questions_sequences(variable, []).uniq
      hash[variable.id]['dd'] = get_node_decision_trees(variable, []).uniq
      hash[variable.id]['df'] = get_node_diagnoses(variable).uniq
      hash[variable.id]['conditioned_by_cc'] = variable.is_a?(Variables::ComplaintCategory) ? [] : variable.complaint_categories.map(&:id)
      hash[variable.id]['referenced_in'] = []
      hash[variable.id]['answers'] = {}

      unless variable.reference_table_x_id.nil?
        hash[variable.id]['reference_table_x_id'] = variable.reference_table_x_id
        hash[variable.id]['reference_table_y_id'] = variable.reference_table_y_id
        hash[variable.id]['reference_table_z_id'] = variable.reference_table_z_id
        hash[variable.id]['reference_table_male'] = variable.reference_table_male_name
        hash[variable.id]['reference_table_female'] = variable.reference_table_female_name
      end

      unless variable.min_value_warning.nil?
        hash[variable.id]['min_value_warning'] = variable.min_value_warning
        hash[variable.id]['min_message_warning'] = return_hstore_translated(variable.min_message_warning_translations)
      end

      unless variable.max_value_warning.nil?
        hash[variable.id]['max_value_warning'] = variable.max_value_warning
        hash[variable.id]['max_message_warning'] = return_hstore_translated(variable.max_message_warning_translations)
      end

      unless variable.min_value_error.nil?
        hash[variable.id]['min_value_error'] = variable.min_value_error
        hash[variable.id]['min_message_error'] = return_hstore_translated(variable.min_message_error_translations)
      end

      unless variable.max_value_error.nil?
        hash[variable.id]['max_value_error'] = variable.max_value_error
        hash[variable.id]['max_message_error'] = return_hstore_translated(variable.max_message_error_translations)
      end

      if variable.is_a?(Variables::ComplaintCategory)
        hash[variable.id]['questions_related_to_cc'] = get_complaint_category_variables(variable)
        hash[variable.id]['questions_sequences_related_to_cc'] = get_complaint_category_questions_sequences(variable)
        hash[variable.id]['diagnoses_related_to_cc'] = get_complaint_category_diagnoses(variable)
      end

      hash[variable.id]['medias'] = extract_medias(variable)

      variable.answers.each do |answer|
        answer_hash = {}
        answer_hash['id'] = answer.id
        answer_hash['reference'] = answer.reference
        answer_hash['label'] = return_hstore_translated(answer.label_translations)
        answer_hash['value'] = answer.value
        answer_hash['operator'] = answer.operator

        hash[variable.id]['answers'][answer.id] = answer_hash
      end

      # Push the patient level questions in an array for medAL-reader to read it easily
      @patient_questions.push(variable.id) if %w(Variables::BasicDemographic Variables::Demographic Variables::ChronicCondition Variables::Vaccine).include?(variable.type)
    end
    hash
  end

  # @params [Node]
  # @return [Array]
  # Get all medias for a node and put it in a hash
  def self.extract_medias(node)
    medias = []
    node.files.map do |file|
      hash = {}
      hash['label'] = return_hstore_translated(file.record.label_translations)
      hash['url'] = url_for(file)
      hash['extension'] = file.blob.filename.extension
      medias.push(hash)
    end
    medias
  end

  # @params [String]
  # @return [String]
  # Format a formula in order to replace references by ids
  def self.format_formula(hash, variable)
    hash['vital_signs'] = []
    formula = variable.formula
    return hash if formula.nil?

    vital_signs = []

    if %w[{ToDay} {ToMonth}].include?(formula)
      formula.tr('{}', '')
    else
      formula.scan(/\[.*?\]/).each do |node_id|
        variable = Variable.find(node_id.tr('[]', ''))
        vital_signs.push(variable.id) if variable.is_a?(Variables::VitalSignAnthropometric)
      end

      formula.sub('{','[').sub('}',']')
    end

    hash['formula'] = formula
    hash['vital_signs'] = vital_signs
    hash
  end

  # @params [Node, Array]
  # @return [Array]
  # Recursive method in order to retrieve every diagnoses for a complaint category.
  def self.get_complaint_category_diagnoses(node)
    decision_trees = []
    node.decision_trees.each do |decision_tree|
      if @decision_trees_ids.include?(decision_tree.id)
        decision_trees << decision_tree.id
      end
    end
    decision_trees
  end

  # @params [Node]
  # @return [Array]
  # Return all questions conditioned by given complaint category
  def self.get_complaint_category_variables(cc)
    NodeComplaintCategory.where(complaint_category: cc).map(&:node).select{|n| n.is_a?(Variable)}.map(&:id)
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
  def self.get_node_decision_trees(node, diagnoses)
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
  def self.get_node_diagnoses(node)
    diagnoses = []
    node.instances.each do |instance|
      diagnosis_id = instance.diagnosis_id
      if diagnosis_id.present? && @diagnoses[diagnosis_id].present?
        diagnoses.push(diagnosis_id)
      end
    end
    diagnoses.uniq
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
      hash[health_care.id]['excluding_nodes_ids'] = @algorithm.arm_control? ? [] : health_care.excluding_node_ids
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
      hash[questions_sequence.id]['dd'] = get_node_decision_trees(questions_sequence, [])
      hash[questions_sequence.id]['df'] = get_node_diagnoses(questions_sequence)
      hash[questions_sequence.id]['conditioned_by_cc'] = questions_sequence.complaint_categories.map(&:id)
      hash[questions_sequence.id]['answer'] = nil
      hash[questions_sequence.id]['value_format'] = 'Boolean'

      # Loop in each instance for defined condition
      questions_sequence.components.variables.includes(:conditions, :children, :nodes, node:[:answer_type, :answers]).each do |instance|
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
