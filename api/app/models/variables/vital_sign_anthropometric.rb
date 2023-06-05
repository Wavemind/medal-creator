# Category of variable concerning vital signs taken during the consultation
# Reference prefix : VS
class Variables::VitalSignAnthropometric < Variable

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:consultation]
    self.step = Variable.steps[:basic_measurements_step]
  end
end
