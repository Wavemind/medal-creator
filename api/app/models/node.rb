# Every component of an algorithm
class Node < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :project

  has_many :children
  has_many :instances, dependent: :destroy
  has_many :medias, as: :fileable, dependent: :destroy
  has_many :diagnoses # as ComplaintCategory
  has_many :node_exclusion, dependent: :destroy

  scope :diagnoses, ->() { where(type: 'Diagnosis') }
  scope :questions, ->() { where(type: Question.descendants.map(&:name)) }
  scope :questions_sequences, ->() { where(type: QuestionsSequence.descendants.map(&:name)) }
  scope :drugs, ->() { where(type: 'HealthCares::Drug') }
  scope :managements, ->() { where(type: 'HealthCares::Management') }

  accepts_nested_attributes_for :medias, reject_if: :all_blank, allow_destroy: true

  validates_presence_of :label_translations

  translates :label, :description, :min_message_error, :max_message_error, :min_message_warning, :max_message_warning, :placeholder

  # Puts nil instead of empty string when formula is not set in the view.
  nilify_blanks only: [:formula]

end
