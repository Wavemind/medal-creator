require 'rails_helper'

module Queries
  module Managements
    describe GetManagements, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:management) { create(:management) }
        let(:variables) { { projectId: management.project_id } }

        it 'return paginated managements' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getManagements',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(management.label_en)
        end

        it 'returns managements with the name matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables.merge({ searchTerm: management.label_en }), context: context
          )

          expect(
            result.dig(
              'data',
              'getManagements',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(management.label_en)
        end

        it 'returns no management with a made up search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables.merge({ searchTerm: "It's me, Malario" }), context: context
          )

          expect(
            result.dig(
              'data',
              'getManagements',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String) {
            getManagements(projectId: $projectId, searchTerm: $searchTerm) {
              edges {
                node {
                  id
                  labelTranslations {
                    en
                  }
                }
              }
            }
          }
        GQL
      end
    end
  end
end
