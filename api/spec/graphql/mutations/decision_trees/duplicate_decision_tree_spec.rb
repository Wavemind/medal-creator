require 'rails_helper'

module Mutations
  module DecisionTrees
    describe DuplicateDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:decision_tree) { DecisionTree.first }
        let(:context) { { current_api_v1_user: User.first } }
        let(:variables) { { id: decision_tree.id } }
        let(:wrong_variables) { { id: 0 } }

        it 'Duplicates components conditions and children properly' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Node.count }.by(2)
              .and change { DecisionTree.count }.by(1)
              .and change { Instance.count }.by(9)
              .and change { Condition.count }.by(6)
              .and change { Child.count }.by(5)
        end

        it 'Returns an error when given a wrong id' do
          result = ApiSchema.execute(query, variables: wrong_variables, context: context)

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('DecisionTree does not exist')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            duplicateDecisionTree(input: { id: $id }) {
              id
            }
          }
        GQL
      end
    end
  end
end
