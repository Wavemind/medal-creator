# Define a final diagnosis
# Reference prefix : DF
class Diagnosis < Node
  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

  validates :level_of_urgency,
            numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }

  before_validation :assign_project, on: :create

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where('label_translations -> :l ILIKE :search', l: language, search: "%#{term}%")
  end

  # Return available nodes for current diagram
  def available_nodes
    excluded_ids = components.select(:node_id)

    project.variables.categories_for_diagram.where.not(id: excluded_ids) +
    project.questions_sequences.where.not(id: excluded_ids) +
    project.managements.where.not(id: excluded_ids) +
    project.drugs.where.not(id: excluded_ids)
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

  # Get the reference prefix according to the type
  def reference_prefix
    I18n.t("diagnoses.reference")
  end
end
