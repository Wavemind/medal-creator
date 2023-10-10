require 'rails_helper'

module Mutations
  module DecisionTrees
    describe DestroyDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:decision_tree) { DecisionTree.first }
        let(:context) { { current_api_v2_user: User.first } }
        let(:variables) { { id: decision_tree.id } }

        it 'Removes components conditions and children in cascade ' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Node.count }.by(-2)
              .and change { DecisionTree.count }.by(-1)
              .and change { Instance.count }.by(-9)
              .and change { Condition.count }.by(-6)
              .and change { Child.count }.by(-5)
        end

        it 'return the destroyed decision tree' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'destroyDecisionTree',
              'id'
            )
          ).to eq(decision_tree.id.to_s)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyDecisionTree(input: { id: $id }) {
              id
            }
          }
        GQL
      end
    end
  end
end
