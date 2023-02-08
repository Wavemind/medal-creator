# Define every nodes below the a given node
class DecisionTree < ApplicationRecord
  attr_accessor :duplicating, :cut_off_value_type

  belongs_to :algorithm
  belongs_to :node # Complaint Category

  has_many :diagnoses, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  validate :validate_translated_fields

  before_save :adjust_cut_offs

  translates :label

  # Validate that the mandatory fields are filled within the project default language
  def validate_translated_fields
    language = algorithm.project.language
    label = "label_#{language.code}"

    return unless send(label).nil?

    errors.add(label,
               I18n.t('errors.messages.hstore_blank', language: language.name))
  end

  # Adjust cut offs at creation
  def adjust_cut_offs
    self.cut_off_start = (cut_off_start * 30.4166667).round if cut_off_start.present? && cut_off_value_type == 'months'
    self.cut_off_end = (cut_off_end * 30.4166667).round if cut_off_end.present? && cut_off_value_type == 'months'
    self.cut_off_value_type = '' # Empty attr accessor to prevent callbacks to falsely do the operation more than once
  end

  # Search by label (hstore) for the project language
  def self.search(q, l)
    where('label_translations -> :l LIKE :search', l: l, search: "%#{q}%")
  end
end
