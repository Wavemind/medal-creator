require 'rails_helper'

module Queries
  module Diagnoses
    describe GetDiagnosis, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:diagnosis) { create(:diagnosis) }
        let(:variables) { { id: diagnosis.id } }

        it 'return a diagnosis' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnosis',
              'labelTranslations',
              'en'
            )
          ).to eq(diagnosis[:label_translations]['en'])
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getDiagnosis(id: $id) {
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
