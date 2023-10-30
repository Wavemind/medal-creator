require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithms, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:algorithm) { create(:algorithm) }
        let(:variables) { { projectId: algorithm.project_id } }

        it 'return paginated algorithm' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithms',
              'edges',
              0,
              'node',
              'name'
            )
          ).to eq(algorithm.name)
        end

        it 'returns algorithms with the name matching search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: algorithm.name }), context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithms',
              'edges',
              0,
              'node',
              'name'
            )
          ).to eq(algorithm.name)
        end

        it 'allows to filter algorithms based on status' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ filters: { statuses: ['archived'] } }), context: context
          )

          algorithms = result.dig('data', 'getAlgorithms', 'edges')

          expect(algorithms.all? { |algorithm| algorithm['node']['status'] == 'archived' }).to be(true)

          result = ApiSchema.execute(
            query, variables: variables.merge({ filters: { statuses: ['draft'] } }), context: context
          )

          algorithms = result.dig('data', 'getAlgorithms', 'edges')

          expect(algorithms.all? { |algorithm| algorithm['node']['status'] == 'draft' }).to be(true)
        end

        it 'returns no algorithm with a made up search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: "It's me, Malario" }), context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithms',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String, $filters: AlgorithmFilterInput) {
            getAlgorithms(projectId: $projectId, searchTerm: $searchTerm, filters: $filters) {
              edges {
                node {
                  id
                  name
                  status
                }
              }
            }
          }
        GQL
      end
    end
  end
end
