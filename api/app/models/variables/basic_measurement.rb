# Category of variable concerning basic measurements taken during the triage
# Reference prefix : BM
class Variables::BasicMeasurement < Variable

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:triage]
    self.step = Variable.steps[:basic_measurements_step]
  end
end
