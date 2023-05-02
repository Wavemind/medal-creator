# Category of variable concerning basic measurements taken during the triage
# Reference prefix : BM
class Variables::BasicMeasurement < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:basic_measurements_step]
  end
end
