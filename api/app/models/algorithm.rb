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

  # TODO : Check if we need minimum_age in validates_presence_of => From the doc :
  # "By default, numericality doesn't allow nil values. You can use allow_nil: true option to permit it."
  validates_presence_of :name, :minimum_age
  validates :description_translations, translated_fields_presence: { project: ->(record) { record.project_id } }
  validates :age_limit_message_translations, translated_fields_presence: { project: ->(record) { record.project_id } }
  validates :age_limit, numericality: { greater_than_or_equal_to: 1 }
  validates :minimum_age, numericality: { greater_than_or_equal_to: 0 }

  before_create :set_status
  before_create :set_order
  before_update :format_consultation_order

  accepts_nested_attributes_for :medal_data_config_variables, reject_if: :all_blank, allow_destroy: true

  translates :age_limit_message, :description

  # Generate Hash for order library
  def self.generate_hash_order(id, parent_id, label, is_neonat, droppable, moveable)
    {
      'id'=> id,
      'parent'=> parent_id,
      'droppable'=> droppable,
      'text'=> label,
      'data'=> {
        'isNeonat'=> is_neonat,
        'isMoveable'=> moveable
      },
    }
  end

  def self.ransackable_attributes(auth_object = nil)
    ["name"]
  end

  # Build consultation order before sending to front
  def build_consultation_order
    language_code = project.language.code
    JSON.parse(full_order_json).map do |element|
      if element['id'].is_a?(String) || element['id'] == 0
        element
      else
        variable = Node.find(element['id'])
        Algorithm.generate_hash_order(variable.id, element['parent'], variable.send("label_#{language_code}"), variable.is_neonat, false, true)
      end
    end
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
  def generate_consultation_order(full_variables = project.variables)
    tree = []
    language_code = project.language.code

    Variable.steps.keys.each do |step_name|
      tree.push(Algorithm.generate_hash_order(step_name, 0, I18n.t("variables.steps.#{step_name}"), false, true, false))
      if %w(medical_history_step physical_exam_step).include?(step_name)
        tree = generate_system_orders(tree, full_variables, step_name, language_code)
      elsif step_name == 'complaint_categories_step'
        tree = generate_complaint_category_order(tree, full_variables, step_name, language_code)
      else
        if step_name == 'registration_step'
          tree = generate_basic_questions_order(tree, step_name)
        end

        full_variables.select{|v| v['step'] == step_name}.each do |question|
          tree.push(Algorithm.generate_hash_order(question.id, step_name, question.send("label_#{language_code}"), question.is_neonat, false, true))
        end
      end
    end

    tree.to_json
  end

  # @return [String]
  # Return the algorithm name (same method than other diagrams)
  # /!\ param not used but needed for this generic method (DecisionTree, Variable, Drug, ...)
  def reference_label(language = 'en')
    name
  end

  private

  # Format the full order before saving in database
  def format_consultation_order
    if full_order_json_changed?
      order = JSON.parse(full_order_json)
      new_order = order.map do |element|
        (element['id'].is_a?(String) || element['id'] == 0) ? element : {'id'=> element['id'], 'parent'=> element['parent']}
      end
      self.full_order_json = new_order.to_json
    end
  end

  # Generate hashes for order by system for physical exam and medical history steps
  def generate_system_orders(tree, full_variables, step_name, language_code)
    Variable.systems.keys.each do |system_name|
      system_id = "#{step_name}_#{system_name}"
      tree.push(Algorithm.generate_hash_order(system_id, step_name, I18n.t("variables.systems.#{system_name}"), false, true, true))

      full_variables.select{|v| v['step'] == step_name && v['system'] == system_name}.each do |question|
        tree.push(Algorithm.generate_hash_order(question.id, system_id, question.send("label_#{language_code}"), question.is_neonat, false, true))
      end
    end

    tree
  end

  # Generate hashes for order in complaint category step
  def generate_complaint_category_order(tree, full_variables, step_name, language_code)
    tree.push(Algorithm.generate_hash_order('older_children', step_name, I18n.t('older_children'), false, true, false))

    full_variables.select{|v| v['step'] == step_name && !v['is_neonat']}.each do |question|
      tree.push(Algorithm.generate_hash_order(question.id, 'older_children', question.send("label_#{language_code}"), false, false, true))
    end

    tree.push(Algorithm.generate_hash_order('neonat_children', step_name, I18n.t('neonat_children'), false, true, false))

    full_variables.select{|v| v['step'] == step_name && v['is_neonat']}.each do |question|
      tree.push(Algorithm.generate_hash_order(question.id, 'neonat_children', question.send("label_#{language_code}"), true, false, true))
    end

    tree
  end

  # Add the 3 hard coded variables in the order
  def generate_basic_questions_order(tree, step_name)
    tree.push(Algorithm.generate_hash_order('first_name', step_name, I18n.t('variables.basic_variables.first_name'), false, false, true))
    tree.push(Algorithm.generate_hash_order('last_name', step_name, I18n.t('variables.basic_variables.last_name'), false, false, true))
    tree.push(Algorithm.generate_hash_order('birth_date', step_name, I18n.t('variables.basic_variables.birth_date'), false, false, true))

    tree
  end

  # Associate default consultation order
  def set_order
    self.full_order_json = self.generate_consultation_order
    self.format_consultation_order
  end

  # By default, algorithm is in draft
  def set_status
    self.status = :draft
  end
end
