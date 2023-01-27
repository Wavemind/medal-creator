# Define a variable to give to medal_data for a version
class MedalDataConfigVariable < ApplicationRecord
  belongs_to :algorithm
  belongs_to :question
end
