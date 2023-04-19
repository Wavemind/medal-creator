# Version of an algorithm with its logic
class Algorithm < ApplicationRecord
  enum mode: %i[intervention arm_control]
  enum status: %i[prod draft archived]

  attr_accessor :triage_id, :cc_id

  belongs_to :project

  has_many :decision_trees, dependent: :destroy
  has_many :algorithm_languages, dependent: :destroy
  has_many :languages, through: :algorithm_languages
  has_many :medal_data_config_variables, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  scope :archived, -> { where(archived: true) }
  scope :active, -> { where(archived: false) }

  validates_presence_of :name, :minimum_age
  validates :description_translations, translated_fields_presence: { project: ->(record) { record.project_id } }
  validates :age_limit_message_translations, translated_fields_presence: { project: ->(record) { record.project_id } }
  validates :age_limit, numericality: { greater_than_or_equal_to: 1 }
  validates :minimum_age, numericality: { greater_than_or_equal_to: 0 }

  before_create :set_status

  accepts_nested_attributes_for :medal_data_config_variables, reject_if: :all_blank, allow_destroy: true

  translates :age_limit_message, :description

  # Return nodes that are called by the json service
  def extract_used_nodes
    nodes = []

    components.includes(:node).each do |instance|
      nodes.push(instance.node)
    end

    decision_trees.each do |decision_tree|
      decision_tree.components.includes(:node).variables.each do |instance|
        nodes.push(instance.node)
      end

      decision_tree.components.includes(:node).questions_sequences.each do |instance|
        nodes = instance.node.extract_nodes(nodes)
      end
    end
    nodes.uniq
  end

  # @return [String]
  # Return the algorithm name (same method than other diagrams)
  def reference_label(language = 'en')
    name
  end

  private

  # By default, algorithm is in draft
  def set_status
    self.status = :draft
  end
end
