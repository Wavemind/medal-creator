# Define the instance of a node in a diagnosis
class Instance < ApplicationRecord
  belongs_to :node
  belongs_to :instanceable, polymorphic: true
  belongs_to :diagnosis, optional: true

  has_many :children
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

  before_create :check_category
  before_create :diverse_x_position
  after_create :set_decision_tree_last_update
  before_update :set_decision_tree_if_update
  before_destroy :remove_condition_from_children
  after_destroy :set_decision_tree_last_update

  validates :instanceable_type, inclusion: { in: %w(Algorithm DecisionTree Node) }
  validates_uniqueness_of :node_id, scope: [:instanceable_id, :instanceable_type, :diagnosis_id]

  validates :duration_translations, translated_fields_presence: { project: lambda { |record|
    record.node.project_id
  } }, unless: :is_pre_referral

  validates :duration_translations, translated_fields_absence: { project: lambda { |record|
    record.node.project_id
  } }, if: :is_pre_referral

  # Get translatable attributes
  def self.translatable_params
    %w[duration description]
  end

  # Return the diagram where the instance is (so the final diagnosis and not the diagnosis if it's a treatment variable)
  def diagram
    diagnosis.present? ? diagnosis : instanceable
  end

  private

  # Ensure that the instance to be created is not an excluded type for the diagram
  def check_category
    errors.add(:basic, I18n.t('activerecord.errors.diagrams.wrong_category')) if Node.excluded_categories(instanceable).include?(node.type)
  end

  def diverse_x_position
    self.position_x = rand(-1000..1000) unless position_x.present?
  end

  # Delete properly conditions from children in the current diagnosis or predefined syndrome.
  def remove_condition_from_children
    children.each do |child|
      instance = child.node.instances.find_by(instanceable: instanceable, diagnosis_id: diagnosis_id)
      instance.conditions.where(answer_id: node.answers.map(&:id)).destroy_all
    end
  end

  # Only trigger update for the decision tree if this is not only a replacement in diagram (positions)
  def set_decision_tree_if_update
    set_decision_tree_last_update if (changes.keys - %w[position_x position_y updated_at]).any?
  end

  # Set the decision_tree updated_at if an instance is created, updated or destroyed
  def set_decision_tree_last_update
    instanceable.touch if instanceable.is_a? DecisionTree
  end
end
