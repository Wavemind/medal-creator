# Define every nodes below the a given node
class DecisionTree < ApplicationRecord
  attr_accessor :duplicating, :cut_off_value_type

  belongs_to :algorithm
  belongs_to :node # Complaint Category

  has_many :diagnoses, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  translates :label
end
