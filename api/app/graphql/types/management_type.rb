module Types
  class ManagementType < Types::NodeType
    field :level_of_urgency, Integer
    field :is_referral, Boolean
    field :excluding_nodes, [Types::ManagementType]
    field :excluded_nodes, [Types::ManagementType]
  end
end
