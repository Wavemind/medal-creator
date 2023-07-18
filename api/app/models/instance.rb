# Define the instance of a node in a diagnosis
class Instance < ApplicationRecord
  belongs_to :node
  belongs_to :instanceable, polymorphic: true
  belongs_to :diagnosis, optional: true

  has_many :children, dependent: :destroy
  has_many :nodes, through: :children # TODO : check if necessary
  has_many :conditions, dependent: :destroy

  scope :managements, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Management') }
  scope :variables, lambda { joins(:node).includes(:conditions).where('nodes.type IN (?)', Variable.descendants.map(&:name)) }
  scope :questions_sequences, lambda { joins(:node).includes(:conditions).where('nodes.type IN (?)', QuestionsSequence.descendants.map(&:name)) }
  scope :drugs, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Drug') }
  scope :diagnoses, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'Diagnosis') }

  # Allow to filter if the node is used as a health care condition or as a diagnosis condition. A node can be used in both of them.
  scope :decision_tree_diagram, -> { where(diagnosis_id: nil) }

  translates :duration, :description

  after_create :set_decision_tree_last_update
  before_update :set_decision_tree_if_update
  before_destroy :set_decision_tree_last_update

  validates :instanceable_type, inclusion: { in: %w(Algorithm DecisionTree Node) }
  validates_uniqueness_of :node_id, scope: [:instanceable_id, :instanceable_type, :diagnosis_id]

  private

  # Only trigger update for the decision tree if this is not only a replacement in diagram (positions)
  def set_decision_tree_if_update
    set_decision_tree_last_update if (changes.keys - %w[position_x position_y updated_at]).any?
  end

  # Set the decision_tree updated_at if an instance is created, updated or destroyed
  def set_decision_tree_last_update
    instanceable.touch if instanceable.is_a? DecisionTree
  end
end
