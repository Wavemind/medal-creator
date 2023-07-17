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

  after_create :generate_reference, if: Proc.new { value != 'not_available' && !self.node.is_a?(QuestionsSequence) && ![1,7,8].include?(self.node.answer_type_id) }

  translates :label

  # Return reference with its prefix
  def full_reference
    "#{node.full_reference}_#{reference}"
  end

  # @return [String]
  # Return the label with the reference for the view
  def reference_label(l = 'en')
    "#{full_reference} - #{self.send("label_#{l}")}"
  end

  private


  # Generate the reference automatically using the variable
  def generate_reference
    if node.answers.count > 1
      self.reference = node.answers.maximum(:reference) + 1
    else
      self.reference = 1
    end
    self.save
  end
end
