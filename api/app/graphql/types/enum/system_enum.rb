module Types
  module Enum
    class SystemEnum < Types::BaseEnum
      Variable.systems.keys.each do |option|
        value option.downcase, value: option
      end
    end
  end
end
