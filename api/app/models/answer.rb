# Every answers to every variables
class Answer < ApplicationRecord
  enum operator: %i[less between more_or_equal]

  belongs_to :node

  has_many :children

  validates :label_translations, translated_fields_presence: { project: ->(record) { record.node.project_id } }

  validates_presence_of :operator, if: proc {
    value != 'not_available' && node.is_a?(Variable) &&
      !%w[Variables::BasicMeasurement Variables::VitalSignAnthropometric].include?(node.type) &&
      node.answer_type.display == 'Input'
  }

  translates :label
end
