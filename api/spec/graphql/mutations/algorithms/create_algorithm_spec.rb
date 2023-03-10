require 'rails_helper'

module Mutations
  module Algorithms
    describe CreateAlgorithm, type: :request do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        # let(:variables) { { params: { algorithms(:one) } } }

        it 'creates a algorithm' do
          expect do
            RailsGraphqlSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Algorithm.count }.by(1)
        end

        it 'returns a algorithm' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'createAlgorithm',
              'algorithm',
              'name'
            )
          ).to eq('New algorithm')
        end
      end

      def query
        <<~GQL
          mutation($params: AlgorithmInput!) {
            createAlgorithm(input: { params: $params }) {
              algorithm {
                id
                name
              }
            }
          }
        GQL
      end
    end
  end
end
