# Define every nodes below the a given node
class DecisionTree < ApplicationRecord
  attr_accessor :duplicating, :cut_off_value_type

  belongs_to :algorithm
  belongs_to :node # Complaint Category

  has_many :diagnoses, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  validates :label_translations, translated_fields_presence: { project: lambda { |record|
                                                                          record.algorithm.project_id
                                                                        } }
  validates :cut_off_start, numericality: true, allow_nil: true
  validates :cut_off_end, numericality: true, allow_nil: true
  validate :cut_off_start_less_than_cut_off_end

  before_validation :adjust_cut_offs

  translates :label

  # Search by label (hstore) for the project language
  def self.search(term, language)
    joins(:diagnoses).where(
      'decision_trees.label_translations -> :l ILIKE :search OR nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%"
    ).distinct
  end

  private

  def cut_off_start_less_than_cut_off_end
    return unless cut_off_start.present? && cut_off_end.present? && cut_off_start >= cut_off_end

    errors.add('cutOffStart', I18n.t('errors.messages.less_than', count: cut_off_end))
  end

  # Adjust cut offs at creation
  def adjust_cut_offs
    self.cut_off_start = (cut_off_start * 30.4166667).round if cut_off_start.present? && cut_off_value_type == 'months'
    self.cut_off_end = (cut_off_end * 30.4166667).round if cut_off_end.present? && cut_off_value_type == 'months'
    self.cut_off_value_type = '' # Empty attr accessor to prevent callbacks to falsely do the operation more than once
  end
end
