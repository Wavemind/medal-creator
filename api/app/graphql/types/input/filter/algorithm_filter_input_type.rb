module Types
  module Input
    module Filter
      class AlgorithmFilterInputType < Types::BaseInputObject
        argument :statuses, [String], required: false
      end
    end
  end
end
