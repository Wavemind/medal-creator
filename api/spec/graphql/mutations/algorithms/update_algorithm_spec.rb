require 'rails_helper'

module Mutations
  module Algorithms
    describe UpdateAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:algorithm) { create(:algorithm) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_algorithm_attributes) { attributes_for(:variables_algorithm) }
        let(:variables) { { params: new_algorithm_attributes.merge({ id: algorithm.id }) } }

        it 'updates the algorithm' do
          ApiSchema.execute(query, variables: variables, context: context)

          algorithm.reload

          expect(algorithm.name).to eq(new_algorithm_attributes[:name])
          expect(algorithm.description_translations['en']).to eq(new_algorithm_attributes[:descriptionTranslations][:en])
        end

        it 'returns the updated algorithm' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateAlgorithm',
              'algorithm',
              'id'
            )
          ).to eq(algorithm.id.to_s)

          expect(
            result.dig(
              'data',
              'updateAlgorithm',
              'algorithm',
              'name'
            )
          ).to eq(new_algorithm_attributes[:name])
        end
      end

      def query
        <<~GQL
          mutation($params: AlgorithmInput!) {
            updateAlgorithm(input: { params: $params }) {
              algorithm {
                id
                name
                descriptionTranslations {
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
