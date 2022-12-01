module Types
  module Input
    class AlgorithmLanguageInputType < Types::BaseInputObject
      argument :algorithm_id, ID, required: false
      argument :language_id, ID, required: false
    end
  end
end
