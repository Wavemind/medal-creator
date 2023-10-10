require 'rails_helper'

module Mutations
  module DecisionTrees
    describe CreateDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:decision_tree_attributes) { attributes_for(:variables_decision_tree) }
        let(:variables) { { params: decision_tree_attributes } }
        let(:invalid_decision_tree_attributes) { attributes_for(:variables_invalid_decision_tree) }
        let(:invalid_variables) { { params: invalid_decision_tree_attributes } }

        it 'create a decisionTree' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { DecisionTree.count }.by(1)
        end

        it 'return a decision tree' do
          result = ApiSchema.execute(
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

        it 'returns error when invalid' do
          result = ApiSchema.execute(
            query, variables: invalid_variables, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Variable $params of type DecisionTreeInput! was provided invalid value for nodeId (Expected value to not be null)')
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
