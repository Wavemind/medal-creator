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
  before_update :format_consultation_order

  accepts_nested_attributes_for :medal_data_config_variables, reject_if: :all_blank, allow_destroy: true

  translates :age_limit_message, :description

  # Generate Hash for order library
  def self.generate_hash_order(id, parent_id, label, is_neonat, droppable, moveable)
    {
      id: id,
      parent: parent_id,
      droppable: droppable,
      text: label,
      data: {
        isNeonat: is_neonat,
        isMoveable: moveable
      },
    }
  end

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

  # Generate origin full order at algorithm creation
  def generate_consultation_order
    tree = []

    Question.steps.each do |step_name, step_index|
      tree.push(Algorithm.generate_hash_order(step_name, 0, I18n.t("questions.steps.#{step_name}"), false, true, false))

      if %w(medical_history_step physical_exam_step).include?(step_name)
        Question.systems.each do |system_name, system_index|
          tree.push(Algorithm.generate_hash_order(system_name, step_name, I18n.t("questions.systems.#{system_name}"), false, true, true))

          project.questions.where(step: step_index, system: system_index).each do |question|
            tree.push(Algorithm.generate_hash_order(question.id, system_name, question.send("label_#{project.language.code}"), question.is_neonat, false, true))
          end
        end
      elsif step_name == 'complaint_categories_step'
        tree.push(Algorithm.generate_hash_order('older_children', step_name, I18n.t('older_children'), false, true, false))

        project.questions.where(step: step_index, is_neonat: false).each do |question|
          tree.push(Algorithm.generate_hash_order(question.id, 'older_children', question.send("label_#{project.language.code}"), false, false, true))
        end

        tree.push(Algorithm.generate_hash_order('neonat_children', step_name, I18n.t('neonat_children'), false, true, false))

        project.questions.where(step: step_index, is_neonat: true).each do |question|
          tree.push(Algorithm.generate_hash_order(question.id, 'neonat_children', question.send("label_#{project.language.code}"), true, false, true))
        end
      else
        if step_name == 'registration_step' # Add the 3 hard coded questions in the order
          tree.push(Algorithm.generate_hash_order('first_name', step_name, I18n.t('questions.basic_questions.first_name'), false, false, true))
          tree.push(Algorithm.generate_hash_order('last_name', step_name, I18n.t('questions.basic_questions.last_name'), false, false, true))
          tree.push(Algorithm.generate_hash_order('birth_date', step_name, I18n.t('questions.basic_questions.birth_date'), false, false, true))
        end
        project.questions.where(step: step_index).each do |question|
          tree.push(Algorithm.generate_hash_order(question.id, step_name, question.send("label_#{project.language.code}"), question.is_neonat, false, true))
        end
      end
    end

    tree.to_json
  end

  # @return [String]
  # Return the algorithm name (same method than other diagrams)
  def reference_label(language = 'en')
    name
  end

  private

  # Format the full order before saving in database
  def format_consultation_order
    if full_order_json_changed?
      self.full_order_json = full_order_json.map do |element|
        (element[:id].is_a?(String) || element[:id] == 0) ? element : {id: element[:id], parent: element[:parent_id]}
      end
    end
  end

  # By default, algorithm is in draft
  def set_status
    self.status = :draft
  end
end
