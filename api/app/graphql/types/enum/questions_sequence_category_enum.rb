module Types
  module Enum
    class QuestionsSequenceCategoryEnum < Types::BaseEnum
      QuestionsSequence.descendants.map(&:name).each do |option|
        value option
      end
    end
  end
end
