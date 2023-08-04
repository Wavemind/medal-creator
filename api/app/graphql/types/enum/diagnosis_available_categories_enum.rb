module Types
  module Enum
    class DiagnosisAvailableCategoriesEnum < Types::BaseEnum
      Node.included_categories(Diagnosis.new).each do |option|
        value option
      end
    end
  end
end
