# Define the instance of a node in a diagnosis
class Instance < ApplicationRecord

  belongs_to :node
  belongs_to :instanceable, polymorphic: true
  belongs_to :diagnosis, optional: true

  has_many :children
  has_many :nodes, through: :children # TODO : check if necessary
  has_many :conditions, dependent: :destroy

  scope :managements, ->() { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Management') }
  scope :questions, ->() { joins(:node).includes(:conditions).where('nodes.type IN (?)', Question.descendants.map(&:name)) }
  scope :questions_sequences, ->() { joins(:node).includes(:conditions).where('nodes.type IN (?)', QuestionsSequence.descendants.map(&:name)) }
  scope :drugs, ->() { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Drug') }
  scope :diagnoses, ->() { joins(:node).includes(:conditions).where('nodes.type = ?', 'Diagnosis') }

  scope :triage_complaint_category, ->() { joins(:node).where('nodes.stage = ? AND nodes.type = ?', Question.stages[:triage], 'Questions::ComplaintCategory') }
  scope :triage_under_complaint_category, ->() { joins(:node).where('nodes.type NOT IN (?)', %w(Questions::UniqueTriageQuestion Questions::ComplaintCategory)) }

  # Allow to filter if the node is used as a health care condition or as a final diagnosis condition. A node can be used in both of them.
  scope :diagnosis_conditions, ->() { includes(:conditions).where(diagnosis_id: nil) }
  scope :health_care_conditions, ->() { includes(:conditions).where.not(diagnosis_id: nil) }

  translates :duration, :description

  after_create :set_decision_tree_last_update
  before_update :set_decision_tree_if_update
  before_destroy :set_decision_tree_last_update


  private

  # Only trigger update for the decision tree if this is not only a replacement in diagram (positions)
  def set_decision_tree_if_update
    set_decision_tree_last_update if (self.changes.keys - %w[position_x position_y updated_at]).any?
  end

  # Set the decision_tree updated_at if an instance is created, updated or destroyed
  def set_decision_tree_last_update
    instanceable.touch if instanceable.is_a? DecisionTree
  end

end
