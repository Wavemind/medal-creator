# Define a final diagnosis
# Reference prefix : DF
class Diagnosis < Node
  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

  before_validation :assign_project, on: :create

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where('label_translations -> :l ILIKE :search', l: language, search: "%#{term}%")
  end

  private

  # Assign project before saving according to the decision tree
  def assign_project
    self.project = decision_tree.algorithm.project
  end
end
