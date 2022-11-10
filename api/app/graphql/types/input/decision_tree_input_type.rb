module Types
  module Input
    class DecisionTreeInputType < Types::BaseInputObject
      argument :reference, Integer, required: false
      argument :node, Types::QuestionType, required: false
      argument :label_translations, Types::HstoreType, required: false
      argument :cut_off_start, Integer, required: false
      argument :cut_off_end, Integer, required: false
      argument :algorithm, Types::AlgorithmType, required: false
    end
  end
end
