# Category of variable concerning vaccines
# Reference prefix : V
class Variables::Vaccine < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:medical_history_step]
  end
end
