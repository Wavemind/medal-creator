module Types
  module Enum
    class VariableCategoryEnum < Types::BaseEnum
      Variable.descendants.map(&:name).each do |option|
        value option.gsub("Variables::", "")
      end

      def self.coerce_input(input_value, context)
        transformed_value = "Variables::#{input_value}"
        validate_enum_value(transformed_value)
        transformed_value
      end

      def self.validate_enum_value(value)
        allowed_values = Variable.descendants.map(&:name)
        unless allowed_values.include?(value)
          raise GraphQL::CoercionError, "Invalid enum value: #{value}"
        end
      end
    end
  end
end
