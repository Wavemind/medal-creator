class DuplicateAlgorithmService
  def self.process(id)
    ActiveRecord::Base.transaction(requires_new: true) do
      begin
        @algorithm = Algorithm.find(id)
        @project = @algorithm.project

        Diagnosis.skip_callback(:create, :after, :generate_reference)
        Node.skip_callback(:create, :after, :generate_reference)

        matching_diagnoses = {}
        matching_instances = {}
        # Recreate version
        new_algorithm = Algorithm.create!(@algorithm.attributes.except('id', 'name', 'job_id', 'created_at', 'updated_at').merge({'name': "Copy of #{@algorithm.name}"}))

        # Recreate components
        @algorithm.components.each do |instance|
          new_instance = new_algorithm.components.create!(instance.attributes.except('id', 'diagnosis_id', 'created_at', 'updated_at'))
          # Store matching instances to recreate conditions afterwards
          matching_instances[instance.id] = new_instance
        end

        # Recreate Medal Data variables
        @algorithm.medal_data_config_variables.each do |config|
          new_algorithm.medal_data_config_variables.create!(config.attributes.except('id', 'algorithm_id'))
        end

        # Recreate diagnoses
        @algorithm.decision_trees.each do |decision_tree|
          new_decision_tree = new_algorithm.decision_trees.create!(decision_tree.attributes.except('id', 'algorithm_id', 'created_at', 'updated_at'))
          # Recreate diagnoses
          decision_tree.diagnoses.each do |diagnosis|
            new_diagnosis = new_decision_tree.diagnoses.create!(diagnosis.attributes.except('id', 'decision_tree_id', 'created_at', 'updated_at'))
            # Store matching final diagnoses to recreate exclusions
            matching_diagnoses[diagnosis.id] = new_diagnosis.id
          end
          # Recreate instances
          decision_tree.components.each do |instance|
            node_id = instance.node.is_a?(Diagnosis) ? matching_diagnoses[instance.node_id] : instance.node_id
            new_instance = new_decision_tree.components.create!(instance.attributes.except('id', 'diagnosis_id', 'created_at', 'updated_at').merge({'diagnosis_id': matching_diagnoses[instance.diagnosis_id], 'node_id': node_id}))
            # Store matching instances to recreate conditions afterwards
            matching_instances[instance.id] = new_instance
          end
        end

        # Recreate exclusions
        NodeExclusion.where(excluding_node_id: matching_diagnoses.keys).each do |exclusion|
          NodeExclusion.create(excluding_node_id: matching_diagnoses[exclusion.excluding_node_id], excluded_node_id: matching_diagnoses[exclusion.excluded_node_id], node_type: 'diagnosis')
        end
        # Recreate conditions
        matching_instances.each do |instance_id, new_instance|
          instance = Instance.find(instance_id)
          instance.conditions.each do |condition|
            new_instance.conditions.create!(condition.attributes.slice('score', 'cut_off_start', 'cut_off_end', 'answer_id'))
          end
        end

        # Algorithm.validate_duplicate(self, new_algorithm)
      rescue => e
        puts e
        puts e.backtrace
        raise ActiveRecord::Rollback, ''
      end
    end
  end
end
