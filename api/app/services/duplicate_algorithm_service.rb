class DuplicateAlgorithmService < WebsocketService
  def self.process(id)
    ActiveRecord::Base.transaction(requires_new: true) do
      begin
        @algorithm = Algorithm.find(id)
        @project = @algorithm.project
        @matching_diagnoses = {}
        @matching_instances = {}
        # Specific websocket
        @channel_name = "duplication_#{@project.id}"
        init

        DecisionTree.skip_callback(:create, :after, :generate_reference, raise: false)
        Node.skip_callback(:create, :before, :generate_reference, raise: false)
        Diagnosis.skip_callback(:create, :after, :instantiate_in_diagram, raise: false)

        # Recreate version
        @new_algorithm = Algorithm.create!(
          @algorithm.attributes.except('id', 'name', 'status', 'job_id', 'created_at', 'updated_at')
                    .merge({'name': "#{I18n.t('copy_of', locale: @project.language.code)}#{@algorithm.name}", 'status': 'draft'}))

        run_function(I18n.t('algorithms.duplication.start_duplication'), 'starting')
        run_function(I18n.t('algorithms.duplication.duplicating_diagram')) { duplicate_diagram }
        run_function(I18n.t('algorithms.duplication.duplicating_languages')) { duplicate_languages }
        run_function(I18n.t('algorithms.duplication.duplicating_medal_data_variables')) { duplicate_medal_data_variables }
        run_function(I18n.t('algorithms.duplication.duplicating_decision_trees')) { duplicate_decision_trees }
        run_function(I18n.t('algorithms.duplication.duplicating_exclusions')) { duplicate_exclusions }
        run_function(I18n.t('algorithms.duplication.adjust_instances')) { adjust_diagnoses_instances }
        run_function(I18n.t('algorithms.duplication.end_duplication'), 'finished')
        remove_history_file
      rescue => e
        run_function(I18n.t('algorithms.duplication.error'), 'error')
        remove_history_file
        raise ActiveRecord::Rollback, ''
      end
    end
  end

  # Duplicate components from algorithm diagram
  def self.duplicate_diagram
    @algorithm.components.each do |instance|
      new_instance = @new_algorithm.components.create!(instance.attributes.except('id', 'diagnosis_id', 'created_at', 'updated_at'))
      # Store matching instances to recreate conditions afterwards
      @matching_instances[instance.id] = new_instance
    end
  end

  # Duplicate algorithm languages
  def self.duplicate_languages
    @algorithm.algorithm_languages.each do |algorithm_language|
      @new_algorithm.algorithm_languages.create!(language: algorithm_language.language)
    end
  end

  # Duplicate medal data variables
  def self.duplicate_medal_data_variables
    @algorithm.medal_data_config_variables.each do |config|
      @new_algorithm.medal_data_config_variables.create!(config.attributes.except('id', 'algorithm_id'))
    end
  end

  # Duplicate decision trees and diagnoses
  def self.duplicate_decision_trees
    @algorithm.decision_trees.each do |decision_tree|
      new_decision_tree = @new_algorithm.decision_trees.create!(decision_tree.attributes.except('id', 'algorithm_id', 'created_at', 'updated_at'))
      # Recreate diagnoses
      decision_tree.diagnoses.each do |diagnosis|
        new_diagnosis = new_decision_tree.diagnoses.create!(diagnosis.attributes.except('id', 'decision_tree_id', 'created_at', 'updated_at'))
        # Store matching final diagnoses to recreate exclusions
        @matching_diagnoses[diagnosis.id] = new_diagnosis.id
      end
      # Recreate instances
      decision_tree.components.each do |instance|
        node_id = instance.node.is_a?(Diagnosis) ? @matching_diagnoses[instance.node_id] : instance.node_id
        new_instance = new_decision_tree.components.create!(instance.attributes.except('id', 'diagnosis_id', 'node_id', 'created_at', 'updated_at')
                                                                    .merge({'diagnosis_id': @matching_diagnoses[instance.diagnosis_id], 'node_id': node_id}))
        # Store matching instances to recreate conditions afterwards
        @matching_instances[instance.id] = new_instance
      end
    end
  end

  # Duplicate exclusions for duplicated diagnoses
  def self.duplicate_exclusions
    NodeExclusion.where(excluding_node_id: @matching_diagnoses.keys).each do |exclusion|
      NodeExclusion.create(excluding_node_id: @matching_diagnoses[exclusion.excluding_node_id], excluded_node_id: @matching_diagnoses[exclusion.excluded_node_id], node_type: 'diagnosis')
    end
  end

  # Adjust new diagnoses instances conditions
  def self.adjust_diagnoses_instances
    @matching_instances.each do |instance_id, new_instance|
      instance = Instance.find(instance_id)
      instance.conditions.each do |condition|
        new_instance.conditions.create!(condition.attributes.slice('score', 'cut_off_start', 'cut_off_end', 'answer_id'))
      end
    end
  end
end
