# Complaint categories restricting questions or questions_sequences
class NodeComplaintCategory < ApplicationRecord
  belongs_to :node
  belongs_to :complaint_category, class_name: 'Node', foreign_key: 'complaint_category_id'
end
