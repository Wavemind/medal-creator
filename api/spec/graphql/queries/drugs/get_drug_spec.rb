require 'rails_helper'

module Queries
  module Drugs
    describe GetDrug, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:drug) { create(:drug) }
        let(:variables) { { id: drug.id } }

        it 'returns a drug' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDrug',
              'labelTranslations',
              'en'
            )
          ).to eq(drug.label_translations['en'])
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('HealthCares::Drug does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getDrug(id: $id) {
              id
              labelTranslations {
                en
              }
            }
          }
        GQL
      end
    end
  end
end
