# Every answers to every questions
class Answer < ApplicationRecord
  enum operator: [:less, :between, :more_or_equal]

  belongs_to :node

  has_many :children

  validates_presence_of :label_translations
  validates_presence_of :operator, if: Proc.new {
    value != 'not_available' && self.node.is_a?(Question) &&
    !%w(Questions::BasicMeasurement Questions::VitalSignAnthropometric).include?(self.node.type) &&
    self.node.answer_type.display == 'Input'
  }

  translates :label

end
