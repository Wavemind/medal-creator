# Define every nodes below the a given node
class Child < ApplicationRecord
  belongs_to :instance
  belongs_to :node

  validates_uniqueness_of :instance_id, scope: :node_id
end
