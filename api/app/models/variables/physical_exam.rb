# Category of variable concerning physical exam to do on the patient
# Reference prefix : PE
class Variables::PhysicalExam < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:physical_exam_step]
  end
end
