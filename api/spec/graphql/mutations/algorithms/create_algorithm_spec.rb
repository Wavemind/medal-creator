require 'rails_helper'

module Mutations
  module Algorithms
    describe CreateAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:algorithm_attributes) { attributes_for(:variables_algorithm) }
        let(:variables) { { params: algorithm_attributes } }
        let(:invalid_algorithm_attributes) { attributes_for(:variables_invalid_algorithm) }
        let(:invalid_variables) { { params: invalid_algorithm_attributes } }

        it 'create a algorithm' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Algorithm.count }.by(1).and change { MedalDataConfigVariable.count }.by(3)
        end

        it 'return a algorithm' do
          result = ApiSchema.execute(
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

        it 'returns error when invalid' do
          result = ApiSchema.execute(
            query, variables: invalid_variables, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['age_limit'][0]).to eq('must be greater than 0')
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
