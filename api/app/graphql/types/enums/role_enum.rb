module Types
  module Enums
    class RoleEnum < Types::BaseEnum
      value 'admin', value: 'admin'
      value 'clinician', value: 'clinician'
      value 'deployment_manager', value: 'deployment_manager'
    end
  end
end
