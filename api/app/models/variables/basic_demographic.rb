# Category of variable for the global information
# Reference prefix : BD
class Variables::BasicDemographic < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:registration_step]
  end
end
