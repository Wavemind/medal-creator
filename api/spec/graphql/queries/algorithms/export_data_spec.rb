require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { create(:algorithm) }

        it 'returns a path if exporting variables' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'variables' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData'
            )
          ).to match(/\.xlsx\z/)
        end

        it 'returns a path if exporting translations' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'translations' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData'
            )
          ).to match(/\.xlsx\z/)
        end

        it 'returns nothing if exporting a non existing export_type' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'not_an_export_type' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData'
            )
          ).to be(nil)
        end

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999, exportType: 'variables' }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Algorithm does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!, $exportType: String!) {
            exportData(id: $id, exportType: $exportType)
          }
        GQL
      end
    end
  end
end
