require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetDecisionTrees, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { Algorithm.first }
        let(:decision_trees) { algorithm.decision_trees }

        it 'return paginated decision trees' do
          result = RailsGraphqlSchema.execute(
            query, variables: { algorithmId: algorithm.id }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDecisionTrees',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_trees.first.label_translations['en'])
        end

        it 'returns decision trees with the label matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: { algorithmId: algorithm.id, searchTerm: 'Col' }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDecisionTrees',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_trees.search('Col', algorithm.project.language.code).first.label_translations['en'])
        end
      end

      def query
        <<~GQL
          query($algorithmId: ID!, $searchTerm: String) {
            getDecisionTrees(algorithmId: $algorithmId, searchTerm: $searchTerm) {
              edges {
                node {
                  id
                  labelTranslations {
                    en
                  }
                }
              }
            }
          }
        GQL
      end
    end
  end
end
