# Category of variable about referral
# Reference prefix : R
class Variables::Referral < Variable

  # Associate proper step depending on category ; empty for parent
  def associate_step
    self.step = Variable.steps[:referral_step]
  end
end
