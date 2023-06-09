require 'rails_helper'

module Queries
  module Variables
    describe GetVariables, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:variable) { create(:variable) }
        let(:variables) { { projectId: variable.project_id } }

        it 'return paginated variables' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getVariables',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(variable.label_en)
        end

        it 'returns variables with the name matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables.merge({ searchTerm: variable.label_en }), context: context
          )

          expect(
            result.dig(
              'data',
              'getVariables',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(variable.label_en)
        end

        it 'returns no variable with a made up search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables.merge({ searchTerm: "It's me, Malario" }), context: context
          )

          expect(
            result.dig(
              'data',
              'getVariables',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String) {
            getVariables(projectId: $projectId, searchTerm: $searchTerm) {
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
