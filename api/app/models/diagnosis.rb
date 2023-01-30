# Define a final diagnosis
# Reference prefix : DF
class Diagnosis < Node
  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

  before_save :assign_project

  def self.search(q, l)
    where("label_translations -> :l LIKE :search", l: l, search: "%#{q}%")
  end

  private

  def assign_project
    self.project = decision_tree.algorithm.project
  end
end
