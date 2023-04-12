require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree) { create(:decision_tree) }
        let(:variables) { { id: decision_tree.id } }

        it 'return a decision tree' do
          result = ApiSchema.execute(
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
