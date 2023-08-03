module Types
  module Input
    module Filter
      class NodeFilterInputType < Types::BaseInputObject
        argument :type, [String], required: false
        argument :is_neonat, Boolean, required: false
      end
    end
  end
end
