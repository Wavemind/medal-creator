require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { create(:algorithm) }
        let(:variables) { { id: algorithm.id } }

        it 'return a algorithm' do
          result = ApiSchema.execute(
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
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getAlgorithm(id: $id) {
              id
              name
            }
          }
        GQL
      end
    end
  end
end
