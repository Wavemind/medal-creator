# Category of variable about referral
# Reference prefix : R
class Variables::Referral < Variable

  # Associate proper step depending on category
  def associate_step
    self.stage = Variable.stages[:diagnosis_management]
    self.step = Variable.steps[:referral_step]
  end
end
