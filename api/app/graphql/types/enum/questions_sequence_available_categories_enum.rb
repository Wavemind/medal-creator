module Types
  module Enum
    class QuestionsSequenceAvailableCategoriesEnum < Types::BaseEnum
      Node.included_categories(QuestionsSequence.new).each do |option|
        value option.gsub(/^[^:]+::/, '')
      end
    end
  end
end
