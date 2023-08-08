module Types
  module Enum
    class VariableCategoryEnum < Types::BaseEnum
      Variable.descendants.map(&:name).each do |option|
        value option.gsub('Variables::', '')
      end

      def self.coerce_input(input_value, _context)
        transformed_value = "Variables::#{input_value}"
        validate_enum_value(transformed_value)
        transformed_value
      end

      def self.coerce_result(ruby_value, _context)
        ruby_value.gsub!('Variables::', '')
      end

      def self.validate_enum_value(value)
        allowed_values = Variable.descendants.map(&:name)
        return if allowed_values.include?(value)

        raise GraphQL::CoercionError, "Invalid enum value: #{value}"
      end
    end
  end
end
