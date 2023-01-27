# Category of question for the first complaints of the patient
# Reference prefix : CC
class Questions::ComplaintCategory < Question
  has_many :node_complaint_categories, foreign_key: 'complaint_category_id' # Complaint category linked to the questions and questions sequences
  has_many :complaint_categories, through: :node_complaint_categories

  def self.policy_class
    QuestionPolicy
  end
end
