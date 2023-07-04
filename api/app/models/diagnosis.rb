# Define a final diagnosis
# Reference prefix : DF
class Diagnosis < Node
  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

  validates :level_of_urgency,
            numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }

  before_validation :assign_project, on: :create

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
