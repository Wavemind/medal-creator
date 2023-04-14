require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { create(:algorithm) }
        let(:variables) { { id: algorithm.id } }

        it 'returns an algorithm' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithm',
              'name'
            )
          ).to eq(algorithm.name)
        end

        it 'returns variables used in an algorithm' do
          algorithm.components.create!(node: Node.first)
          dt = algorithm.decision_trees.create!(label_en: 'Test', node: Node.where(type: 'Variables::ComplaintCategory').first)
          dt.components.create!(node: Node.second)

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithm',
              'usedVariables'
            )
          ).to eq([Node.first.id, Node.second.id])
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getAlgorithm(id: $id) {
              id
              name
              usedVariables
            }
          }
        GQL
      end
    end
  end
end
