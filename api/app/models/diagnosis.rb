# Define a diagnosis
# Reference prefix : D
class Diagnosis < Node
  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

  validates :level_of_urgency,
            numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }

  before_validation :assign_project, on: :create
  after_create :instantiate_in_diagram

  # Return available nodes for current diagram
  # TODO : Check avec Alain to get rid of ligne 17 + bullet
  def available_nodes
    excluded_ids = components.select(:node_id)
    if excluded_ids.any?
      project.nodes.where('id NOT IN (?) AND type NOT IN (?)', excluded_ids, Node.excluded_categories(self))
    else
      project.nodes.where('type NOT IN (?)', Node.excluded_categories(self))
    end
  end

  # Add errors to a diagnosis for its components
  def manual_validate
    components.includes(:node, :children, :conditions).each do |instance|
      if instance.node.is_a?(Variable) || instance.node.is_a?(QuestionsSequence)
        warnings.add(:basic, I18n.t('activerecord.errors.diagrams.node_without_children', reference: instance.node.full_reference)) unless instance.children.any?

        if instance.node.is_a? QuestionsSequence
          instance.node.manual_validate
          errors.add(:basic, I18n.t('activerecord.errors.diagrams.error_in_questions_sequence', reference: instance.node.full_reference)) if instance.node.errors.messages.any?
        end
      end
    end
  end

  # Add a warning level to rails validation
  def warnings
    @warnings ||= ActiveModel::Errors.new(self)
  end



  private

  # Assign project before saving according to the decision tree
  def assign_project
    self.project = decision_tree.algorithm.project
  end

  # Automatically instantiate the diagnosis in the decision tree diagram when created
  def instantiate_in_diagram
    decision_tree.components.create!(node_id: id)
  end

  # Get the reference prefix according to the type
  def reference_prefix
    I18n.t("diagnoses.reference")
  end

end
