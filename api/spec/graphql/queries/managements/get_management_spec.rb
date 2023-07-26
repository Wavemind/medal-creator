require 'rails_helper'

module Queries
  module Managements
    describe GetManagement, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:management) { create(:management) }
        let(:variables) { { id: management.id } }

        it 'returns a management' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getManagement',
              'labelTranslations',
              'en'
            )
          ).to eq(management.label_translations['en'])
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('HealthCares::Management does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getManagement(id: $id) {
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
