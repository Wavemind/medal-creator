# Category of variable concerning vaccines
# Reference prefix : V
class Variables::Vaccine < Variable

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:consultation]
    self.step = Variable.steps[:medical_history_step]
  end

  # Automatically create unavailable answer
  # Create 1 automatic answer if attr_accessor :unavailable in question is checked
  def create_unavailable_answer
    answer = self.answers.new(reference: '0', value: 'not_available', label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.unknown', locale: k)] } ])
    answer.save(validate: false)
  end
end
