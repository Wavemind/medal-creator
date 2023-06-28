# Define every nodes below the a given node
class DecisionTree < ApplicationRecord
  attr_accessor :duplicating, :cut_off_value_type

  belongs_to :algorithm
  belongs_to :node # Complaint Category

  has_many :diagnoses, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  validates :label_translations, translated_fields_presence: { project: lambda { |record|
    record.algorithm.project_id
  } }
  validates :cut_off_start, numericality: true, allow_nil: true
  validates :cut_off_end, numericality: true, allow_nil: true
  validate :cut_off_start_less_than_cut_off_end

  before_validation :adjust_cut_offs
  after_create :generate_reference

  translates :label

  # Search by label (hstore) for the project language
  def self.search(term, language)
    joins(:diagnoses).where(
      'decision_trees.label_translations -> :l ILIKE :search OR nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%"
    ).distinct
  end

  # Return available nodes for current diagram
  def available_nodes
    # Exclude the variables that are already used in the decision tree diagram (it still takes the questions used in the diagnosis diagram, since it can be used in both diagrams)
    excluded_ids = components.decision_tree_diagram.map(&:node_id)

    # Transform Array into ActiveRecord::Relation so it can be searchable
    Node.where(id: (algorithm.project.variables.categories_for_diagram.without_treatment_condition.includes([:answers]).where.not(id: excluded_ids) +
    algorithm.project.questions_sequences.includes([:answers]).where.not(id: excluded_ids) +
    diagnoses.where.not(id: excluded_ids)).pluck(:id))
  end

  def duplicate
    ActiveRecord::Base.transaction(requires_new: true) do
      begin
        new_decision_tree = DecisionTree.create!(attributes.except('id', 'created_at', 'updated_at'))
        matching_diagnoses = {}

        # Recreate final diagnoses
        diagnoses.each do |diagnosis|
          new_diagnosis = new_decision_tree.diagnoses.create!(diagnosis.attributes.except('id', 'decision_tree_id', 'created_at', 'updated_at'))
          matching_diagnoses[diagnosis.id] = new_diagnosis.id
        end

        # Recreate instances
        components.each do |instance|
          node_id = instance.node.is_a?(Diagnosis) ? matching_diagnoses[instance.node_id] : instance.node_id
          new_decision_tree.components.create!(instance.attributes.except('id', 'final_diagnosis_id', 'created_at', 'updated_at').merge({ 'diagnosis_id': matching_diagnoses[instance.diagnosis_id], 'node_id': node_id }))
        end

        # Loop again to recreate conditions
        components.each do |instance|
          node_id = instance.node.is_a?(Diagnosis) ? matching_diagnoses[instance.node_id] : instance.node_id
          new_instance = new_decision_tree.components.find_by(node_id: node_id)
          instance.conditions.each do |condition|
            new_instance.conditions.create!(condition.attributes.except('id', 'created_at', 'updated_at'))
          end
        end

        new_decision_tree

      rescue => e
        puts e
        puts e.backtrace
        raise ActiveRecord::Rollback, ''
      end
    end
  end

  # @return [String]
  # Return full reference
  def full_reference
    I18n.t('decision_trees.reference') + reference.to_s
  end

  # @return [String]
  # Return the label with the reference for the view
  def reference_label(language = 'en')
    "#{full_reference} - #{self.send("label_#{language}")}"
  end

  private

  # Adjust cut offs at creation
  def adjust_cut_offs
    self.cut_off_start = (cut_off_start * 30.4166667).round if cut_off_start.present? && cut_off_value_type == 'months'
    self.cut_off_end = (cut_off_end * 30.4166667).round if cut_off_end.present? && cut_off_value_type == 'months'
    self.cut_off_value_type = '' # Empty attr accessor to prevent callbacks to falsely do the operation more than once
  end

  def cut_off_start_less_than_cut_off_end
    return unless cut_off_start.present? && cut_off_end.present? && cut_off_start >= cut_off_end

    errors.add('cutOffStart', I18n.t('errors.messages.less_than', count: cut_off_end))
  end

  # Automatic reference generation
  def generate_reference
    if algorithm.decision_trees.count > 1
      self.reference = algorithm.decision_trees.maximum(:reference) + 1
    else
      self.reference = 1
    end
    self.save
  end
end
