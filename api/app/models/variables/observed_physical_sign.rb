# Category of variable for the observed physical signs
# Reference prefix : OS
class Variables::ObservedPhysicalSign < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:medical_history_step]
  end
end
