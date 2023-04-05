require 'rails_helper'

module Queries
  module Nodes
    describe GetQuestions, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:question) { create(:question) }
        let(:variables) { { projectId: question.project_id } }

        it 'return paginated questions' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestions',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(question.label_en)
        end

        it 'returns algorithms with the name matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables.merge({ searchTerm: question.label_en }), context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestions',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(question.label_en)
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String) {
            getQuestions(projectId: $projectId, searchTerm: $searchTerm) {
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
