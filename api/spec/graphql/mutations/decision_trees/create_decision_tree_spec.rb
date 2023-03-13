require 'rails_helper'

module Mutations
  module DecisionTrees
    describe CreateDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree_attributes) { attributes_for(:variables_decision_tree) }
        let(:variables) { { params: decision_tree_attributes } }

        it 'create a decisionTree' do
          expect do
            RailsGraphqlSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { DecisionTree.count }.by(1)
        end

        it 'return a decision tree' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'createDecisionTree',
              'decisionTree',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_tree_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: DecisionTreeInput!) {
            createDecisionTree(input: { params: $params }) {
              decisionTree {
                id
                labelTranslations {
                  en
                }
              }
            }
          }
        GQL
      end
    end
  end
end
