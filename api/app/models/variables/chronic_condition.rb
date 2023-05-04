# Category of variable who defines other condition that might influence the present patient condition
# Reference prefix : CH
class Variables::ChronicCondition < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:medical_history_step]
  end
end
