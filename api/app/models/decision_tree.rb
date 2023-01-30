# Define every nodes below the a given node
class DecisionTree < ApplicationRecord
  attr_accessor :duplicating, :cut_off_value_type

  belongs_to :algorithm
  belongs_to :node # Complaint Category

  has_many :diagnoses, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  translates :label

  # Search by label (hstore) for the project language
  def self.search(q, l)
    where("label_translations -> :l LIKE :search", l: l, search: "%#{q}%")
  end
end
