# Category of variable for the medical tests
# Reference prefix : A
class Variables::AssessmentTest < Variable

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:test]
    self.step = Variable.steps[:test_step]
  end

  # Automatically create unavailable answer
  # Create 1 automatic answer if attr_accessor :unavailable in question is checked
  def create_unavailable_answer
    answer = self.answers.new(reference: '0', value: 'not_available', label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.unavailable', locale: k)] } ])
    answer.save(validate: false)
  end
end
