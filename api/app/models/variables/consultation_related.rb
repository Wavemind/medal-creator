# Category of variable concerning variables concerning previous consultations
# Reference prefix : CR
class Variables::ConsultationRelated < Variable

  # Associate proper step depending on category
  def associate_step
    self.step = Variable.steps[:registration_step]
  end
end
