# Every component of an algorithm
class Node < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :project

  has_many :children
  has_many :instances, dependent: :destroy
  has_many :diagnoses # as ComplaintCategory
  has_many :node_exclusions, foreign_key: 'excluding_node_id', dependent: :destroy

  has_many_attached :files

  validates_presence_of :label_translations
  validates :label_translations, translated_fields_presence: { project: lambda { |record|
    record.project_id
  } }

  translates :label, :description, :min_message_error, :max_message_error, :min_message_warning, :max_message_warning,
             :placeholder

  # Puts nil instead of empty string when formula is not set in the view.
  nilify_blanks only: [:formula]
end
