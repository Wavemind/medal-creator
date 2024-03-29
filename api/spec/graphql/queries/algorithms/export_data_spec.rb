require 'rails_helper'

module Queries
  module Algorithms
    describe ExportData, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:algorithm) { create(:algorithm) }

        it 'returns a path if exporting variables' do
          result = ApiSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'variables' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData',
              'url'
            )
          ).to match(/\.xlsx\z/)

          expect(
            result.dig(
              'data',
              'exportData',
              'success'
            )
          ).to be(true)
        end

        it 'returns a path if exporting translations' do
          result = ApiSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'translations' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData',
              'url'
            )
          ).to match(/\.xlsx\z/)

          expect(
            result.dig(
              'data',
              'exportData',
              'success'
            )
          ).to be(true)
        end

        it 'returns nothing if exporting a non existing export_type' do
          result = ApiSchema.execute(
            query, variables: { id: algorithm.id, exportType: 'not_an_export_type' }, context: context
          )

          expect(
            result.dig(
              'data',
              'exportData',
              'url'
            )
          ).to be(nil)

          expect(
            result.dig(
              'data',
              'exportData',
              'success'
            )
          ).to be(false)
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999, exportType: 'variables' }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Algorithm does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!, $exportType: String!) {
            exportData(id: $id, exportType: $exportType) {
              success
              url
            }
          }
        GQL
      end
    end
  end
end
