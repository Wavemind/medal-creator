module Types
  module Enum
    class AlgorithmStatusEnum < Types::BaseEnum
      Algorithm.statuses.keys.each do |option|
        value option
      end
    end
  end
end
