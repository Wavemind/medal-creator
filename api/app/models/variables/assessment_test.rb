# Category of variable for the medical tests
# Reference prefix : A
class Variables::AssessmentTest < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:test_step]
  end
end
