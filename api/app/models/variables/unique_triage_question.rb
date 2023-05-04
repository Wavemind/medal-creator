# Category of variable who defines first basic variable to possibly improve priority of a patient
# Reference prefix : UT
class Variables::UniqueTriageQuestion < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:first_look_assessment_step]
  end
end
