module Types
  module Enum
    class OperatorEnum < Types::BaseEnum
      Answer.operators.keys.each do |option|
        value option
      end
    end
  end
end
