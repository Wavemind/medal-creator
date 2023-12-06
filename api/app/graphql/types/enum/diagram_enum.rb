module Types
  module Enum
    class DiagramEnum < Types::BaseEnum
      value 'Algorithm'
      value 'DecisionTree'
      value 'Diagnosis'
      value 'QuestionsSequence'
      value 'QuestionsSequenceScored'

      def self.coerce_input(input_value, _context)
        input_value.include?('QuestionsSequence') ? 'Node' : input_value
      end
    end
  end
end
