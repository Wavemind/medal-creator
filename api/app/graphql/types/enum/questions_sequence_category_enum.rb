module Types
  module Enum
    class QuestionsSequenceCategoryEnum < Types::BaseEnum
      QuestionsSequence.descendants.map(&:name).each do |option|
        value option.gsub('QuestionsSequences::', '')
      end

      def self.coerce_input(input_value, _context)
        transformed_value = "QuestionsSequences::#{input_value}"
        validate_enum_value(transformed_value)
        transformed_value
      end

      def self.coerce_result(ruby_value, _context)
        ruby_value.gsub!('QuestionsSequences::', '')
      end

      def self.validate_enum_value(value)
        allowed_values = QuestionsSequence.descendants.map(&:name)
        return if allowed_values.include?(value)

        raise GraphQL::CoercionError, "Invalid enum value: #{value}"
      end
    end
  end
end
