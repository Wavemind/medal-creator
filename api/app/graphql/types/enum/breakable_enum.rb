module Types
  module Enum
    class BreakableEnum < Types::BaseEnum
      Formulation.breakables.keys.each do |option|
        value option.downcase, value: option
      end
    end
  end
end
