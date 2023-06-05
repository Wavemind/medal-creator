module Types
  module Enum
    class RoundEnum < Types::BaseEnum
      Variable.rounds.keys.each do |option|
        value option
      end
    end
  end
end
