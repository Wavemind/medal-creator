module Types
  module Enum
    class NodeExclusionTypeEnum < Types::BaseEnum
      NodeExclusion.node_types.keys.each do |option|
        value option
      end
    end
  end
end
