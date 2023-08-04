module Types
  module Enum
    class DecisionTreeAvailableCategoriesEnum < Types::BaseEnum
      Node.included_categories(DecisionTree.new).each do |option|
        value option.gsub(/^[^:]+::/, '')
      end
    end
  end
end
