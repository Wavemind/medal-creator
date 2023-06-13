module Types
  module Input
    class ManagementInputType < Types::Input::NodeInputType
      argument :level_of_urgency, Integer, required: false
      argument :is_referral, Integer, required: false
    end
  end
end
