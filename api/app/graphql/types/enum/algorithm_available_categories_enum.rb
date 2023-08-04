module Types
  module Enum
    class AlgorithmAvailableCategoriesEnum < Types::BaseEnum
      Node.included_categories(Algorithm.new).each do |option|
        value option
      end
    end
  end
end
