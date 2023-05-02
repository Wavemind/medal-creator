# Category of variable concerning exposures to environments at risk
# Reference prefix : E
class Variables::Exposure < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:medical_history_step]
  end
end
