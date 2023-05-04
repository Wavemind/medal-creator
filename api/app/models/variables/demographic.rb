# Category of variable for the global information
# Reference prefix : D
class Variables::Demographic < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:registration_step]
  end
end
