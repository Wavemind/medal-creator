# Define the conditions for a node to be available.
class Condition < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :instance
  belongs_to :answer

  before_validation :prevent_loop, unless: proc {(instance.instanceable.is_a?(DecisionTree) && instance.instanceable.duplicating)}
  after_create :set_decision_tree_last_update
  after_update :set_decision_tree_last_update
  before_destroy :set_decision_tree_last_update
  before_destroy :remove_children

  validates_uniqueness_of :instance_id, scope: :answer_id

  # Update decision tree if a link is created, edited or destroyed
  def set_decision_tree_last_update
    diagram = instance.instanceable
    diagram.touch if diagram.is_a? DecisionTree
  end

  # Get the instance of node answer
  # @return [Instance] parent_instance
  def parent_instance
    instance.instanceable.components.find_by(node_id: answer.node_id, diagnosis_id: instance.diagnosis_id)
  end

  private

  # Create children from conditions automatically
  def create_children
    parent = answer.node.instances.find_by(instanceable: instance.instanceable, diagnosis: instance.diagnosis)
    parent.children.create!(node: instance.node) unless parent.nil? || parent.children.where(node: instance.node).any?
  end

  # @param [Object] child
  # Verify if current instance is a child of himself
  # @return [Boolean]
  def is_child(new_instance)
    new_instance.children.each do |child|
      # Gets child instance for the same instanceable (PS OR Diagnosis)
      child_instance = instance.instanceable.components.includes(:node).select { |c| c.node == child.node }.first
      if child_instance == instance || (child_instance.present? && child_instance.children.any? && is_child(child_instance))
        return true
      end
    end
    false
  end

  # Before creating a condition, verify that it is not doing a loop. Create the Child in the opposite way in the process
  def prevent_loop
    ActiveRecord::Base.transaction(requires_new: true) do
      create_children
      if instance.children.any? && is_child(instance)
        errors.add(:base, I18n.t('activerecord.errors.conditions.loop'))
        raise ActiveRecord::Rollback, I18n.t('activerecord.errors.conditions.loop')
      end
    end
  end

  # Remove child if last condition linking two nodes
  def remove_children
    parent_node = answer.node
    child_instance = instance
    node_answers_ids = parent_node.answers.map(&:id) - [answer_id]
    child = Child.find_by(
      instance: parent_node.instances.find_by(instanceable: child_instance.instanceable,
                                              diagnosis: child_instance.diagnosis), node: child_instance.node
    )
    child.destroy! unless child_instance.conditions.where(answer_id: node_answers_ids).any?
  end
end
