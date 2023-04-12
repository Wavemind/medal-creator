# Category of variable for the first complaints of the patient
# Reference prefix : CC
class Variables::ComplaintCategory < Variable
  has_many :node_complaint_categories, foreign_key: 'complaint_category_id' # Complaint category linked to the variables and variables sequences
  has_many :complaint_categories, through: :node_complaint_categories
end
