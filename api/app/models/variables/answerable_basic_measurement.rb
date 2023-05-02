# Category of variable to complement basic measurements variables
# Reference prefix : AM
class Variables::AnswerableBasicMeasurement < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:basic_measurements_step]
  end
end
