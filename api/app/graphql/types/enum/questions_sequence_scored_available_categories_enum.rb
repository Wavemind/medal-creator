module Types
  module Enum
    class QuestionsSequenceScoredAvailableCategoriesEnum < Types::BaseEnum
      Node.included_categories(QuestionsSequences::Scored.new).each do |option|
        value option
      end
    end
  end
end
