require 'rails_helper'

module Mutations
  module Algorithms
    describe DestroyAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:algorithm) { create(:algorithm) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:variables) { { id: algorithm.id } }

        it 'destroy the algorithm' do
          response = ApiSchema.execute(query, variables: variables, context: context)
          algorithm.reload

          expect(algorithm.status).to eq('archived')
        end

        it 'returns the destroyed algorithm' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'destroyAlgorithm',
              'id'
            )
          ).to eq(algorithm.id.to_s)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyAlgorithm(input: { id: $id }) {
              id
            }
          }
        GQL
      end
    end
  end
end
