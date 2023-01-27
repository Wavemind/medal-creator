# Define the conditions for a node to be available.
class Condition < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :instance
  belongs_to :answer
end
