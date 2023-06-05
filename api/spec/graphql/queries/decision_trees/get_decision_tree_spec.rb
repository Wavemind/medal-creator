require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree) { create(:decision_tree) }
        let(:variables) { { id: decision_tree.id } }

        it 'return a decision tree' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDecisionTree',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_tree.label_translations['en'])
        end

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('DecisionTree does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getDecisionTree(id: $id) {
              id
              labelTranslations {
                en
              }
            }
          }
        GQL
      end
    end
  end
end
