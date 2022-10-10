# Define every nodes below the a given node
class Child < ApplicationRecord

  belongs_to :instance
  belongs_to :node

end
