module Types
  module Enum
    class VariableCategoryEnum < Types::BaseEnum
      Variable.descendants.map(&:name).each do |option|
        value option
      end
    end
  end
end
