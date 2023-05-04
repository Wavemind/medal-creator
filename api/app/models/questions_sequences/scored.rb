# Define a sequence based on the score to each answers
# Reference prefix : QSS
class QuestionsSequences::Scored < QuestionsSequence

  def self.variable
    'scored'
  end

end
