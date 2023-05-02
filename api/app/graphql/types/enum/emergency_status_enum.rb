module Types
  module Enum
    class EmergencyStatusEnum < Types::BaseEnum
      Variable.emergency_statuses.keys.each do |option|
        value option.upcase, value: option
      end
    end
  end
end
