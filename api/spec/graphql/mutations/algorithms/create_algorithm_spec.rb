require 'rails_helper'

module Mutations
  module Algorithms
    describe CreateAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm_attributes) { attributes_for(:variables_algorithm) }
        let(:variables) { { params: algorithm_attributes } }

        it 'create a algorithm' do
          expect do
            RailsGraphqlSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Algorithm.count }.by(1)
        end

        it 'return a algorithm' do
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
          ).to eq(algorithm_attributes[:name])
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
