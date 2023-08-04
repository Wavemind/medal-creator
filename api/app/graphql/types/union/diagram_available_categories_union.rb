module Types
  module Union
    class DiagramAvailableCategoriesUnion < Types::BaseUnion
      description "Union type for Enum field"

      # Spécifiez les types possibles pour le champ enumField
      possible_types Types::Enum::AlgorithmAvailableCategoriesEnum,
                     Types::Enum::DecisionTreeAvailableCategoriesEnum,
                     Types::Enum::DiagnosisAvailableCategoriesEnum,
                     Types::Enum::QuestionsSequenceAvailableCategoriesEnum,
                     Types::Enum::QuestionsSequenceScoredAvailableCategoriesEnum

    end
  end
end