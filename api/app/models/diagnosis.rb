# Define a final diagnosis
# Reference prefix : DF
class Diagnosis < Node

  belongs_to :decision_tree

  has_many :components, class_name: 'Instance', dependent: :destroy

end
