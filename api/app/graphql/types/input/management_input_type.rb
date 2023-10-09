module Types
  module Input
    class ManagementInputType < Types::Input::NodeInputType
      argument :level_of_urgency, Integer, required: false
      argument :is_referral, Boolean, required: false
      argument :is_neonat, Boolean, required: false
    end
  end
end
