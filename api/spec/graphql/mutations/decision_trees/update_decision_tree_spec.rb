require 'rails_helper'

module Mutations
  module DecisionTrees
    describe UpdateDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:decision_tree) { create(:decision_tree) }
        let(:context) { { current_api_v2_user: User.first } }
        let(:new_decision_tree_attributes) { attributes_for(:variables_decision_tree) }
        let(:variables) { { params: new_decision_tree_attributes.merge({ id: decision_tree.id }) } }

        it 'updates the decision tree' do
          ApiSchema.execute(query, variables: variables, context: context)

          decision_tree.reload

          expect(decision_tree.label_translations['en']).to eq(new_decision_tree_attributes[:labelTranslations][:en])
        end

        it 'returns the updated decision tree' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateDecisionTree',
              'decisionTree',
              'id'
            )
          ).to eq(decision_tree.id.to_s)

          expect(
            result.dig(
              'data',
              'updateDecisionTree',
              'decisionTree',
              'labelTranslations',
              'en'
            )
          ).to eq(new_decision_tree_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: DecisionTreeInput!) {
            updateDecisionTree(input: { params: $params }) {
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
