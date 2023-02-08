# Version of an algorithm with its logic
class Algorithm < ApplicationRecord
  enum mode: %i[intervention arm_control]
  enum status: %i[prod draft archived]

  attr_accessor :triage_id, :cc_id

  belongs_to :project

  has_many :decision_trees, dependent: :destroy
  has_many :algorithm_languages, dependent: :destroy
  has_many :languages, through: :algorithm_languages
  has_many :medal_data_config_variables, dependent: :destroy
  has_many :components, class_name: 'Instance', as: :instanceable, dependent: :destroy

  scope :archived, -> { where(archived: true) }
  scope :active, -> { where(archived: false) }

  validates_presence_of :name, :minimum_age
  validate :validate_translated_fields
  validates :age_limit, numericality: { greater_than_or_equal_to: 1 }
  validates :minimum_age, numericality: { greater_than_or_equal_to: 0 }

  before_create :set_status

  accepts_nested_attributes_for :medal_data_config_variables, reject_if: :all_blank, allow_destroy: true

  translates :age_limit_message, :description

  # Validate that the mandatory fields are filled within the project default language
  def validate_translated_fields
    language = project.language
    description_field = "description_#{language.code}"
    age_limit_message_field = "age_limit_message_#{language.code}"

    if send(description_field).nil?
      errors.add(description_field,
                 I18n.t('errors.messages.hstore_blank', language: language.name))
    end
    return unless send(age_limit_message_field).nil?

    errors.add(age_limit_message_field,
               I18n.t('errors.messages.hstore_blank', language: language.name))
  end

  private

  # By default, algorithm is in draft
  def set_status
    self.status = :draft
  end
end
