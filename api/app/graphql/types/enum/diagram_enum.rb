module Types
  module Enum
    class DiagramEnum < Types::BaseEnum
      value 'Algorithm'
      value 'DecisionTree'
      value 'Diagnosis'
      value 'QuestionsSequence'
      value 'QuestionsSequenceScored'

      def self.coerce_input(input_value, _context)
        input_value == 'QuestionsSequenceScored' ? 'QuestionsSequences::Scored' : input_value
      end
    end
  end
end
