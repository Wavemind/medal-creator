# Generate this query to generate enum for graphql
module Queries
  class GetDummy < Queries::BaseQuery
    type String, null: true
    argument :algorithm_dummy_field, Types::Enum::AlgorithmAvailableCategoriesEnum
    argument :decision_tree_dummy_field, Types::Enum::DecisionTreeAvailableCategoriesEnum
    argument :diagnosis_dummy_field, Types::Enum::DiagnosisAvailableCategoriesEnum
    argument :questions_sequence_dummy_field, Types::Enum::QuestionsSequenceAvailableCategoriesEnum
    argument :questions_sequence_scored_dummy_field, Types::Enum::QuestionsSequenceScoredAvailableCategoriesEnum

    def resolve()
    end
  end
end
