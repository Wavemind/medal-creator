# Define a variable to give to medal_data for an algorithm
class MedalDataConfigVariable < ApplicationRecord
  belongs_to :algorithm
  belongs_to :variable

  validates_presence_of :label, :api_key, :variable
end
