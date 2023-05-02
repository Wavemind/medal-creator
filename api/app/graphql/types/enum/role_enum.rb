module Types
  module Enum
    class RoleEnum < Types::BaseEnum
      User.roles.keys.each do |option|
        value option.upcase, value: option
      end
    end
  end
end
