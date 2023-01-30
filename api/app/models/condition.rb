# Define the conditions for a node to be available.
class Condition < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :instance
  belongs_to :answer

  after_create :set_decision_tree_last_update
  after_update :set_decision_tree_last_update
  before_destroy :set_decision_tree_last_update

  # Update decision tree if a link is created, edited or destroyed
  def set_decision_tree_last_update
    diagram = instance.instanceable
    diagram.touch if diagram.is_a? DecisionTree
  end
end
