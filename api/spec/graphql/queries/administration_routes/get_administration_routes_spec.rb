require 'rails_helper'

module Queries
  module AdministrationRoutes
    describe GetAdministrationRoutes, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }

        it 'return languages' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getAdministrationRoutes',
              -1,
              'nameTranslations',
              'en'
            )
          ).to eq(AdministrationRoute.last.name_en)
        end
      end

      def query
        <<~GQL
          query {
            getAdministrationRoutes {
              nameTranslations {
                en
              }
            }
          }
        GQL
      end
    end
  end
end
