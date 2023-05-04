module Types
  module Enum
    class Category < Types::BaseEnum
      Variable.descendants.map(&:name).each do |option|
        value option
      end
    end
  end
end
