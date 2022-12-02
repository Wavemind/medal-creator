# Version of an algorithm with its logic
class Algorithm < ApplicationRecord
  enum mode: [:intervention, :arm_control]
  enum status: [:prod, :draft, :archived]

  attr_accessor :triage_id
  attr_accessor :cc_id

  belongs_to :project

  has_many :decision_trees, dependent: :destroy
  has_many :algorithm_languages
  has_many :languages, through: :algorithm_languages
  has_many :medal_data_config_variables, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  scope :archived, ->(){ where(archived: true) }
  scope :active, ->(){ where(archived: false) }

  validates_presence_of :name, :description, :age_limit, :age_limit_message, :minimum_age
  validates :age_limit, numericality: { greater_than_or_equal_to: 1 }
  validates :minimum_age, numericality: { greater_than_or_equal_to: 0 }

  accepts_nested_attributes_for :medal_data_config_variables, reject_if: :all_blank, allow_destroy: true

  translates :age_limit_message, :description
end
