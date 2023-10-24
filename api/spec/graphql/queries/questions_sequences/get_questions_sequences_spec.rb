require 'rails_helper'

module Queries
  module QuestionsSequences
    describe GetQuestionsSequences, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:questions_sequence) { create(:questions_sequence) }
        let(:variables) { { projectId: questions_sequence.project_id } }

        it 'return paginated questions sequences' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestionsSequences',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(questions_sequence.label_en)
        end

        it 'returns questions sequences with the name matching search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: questions_sequence.label_en }), context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestionsSequences',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(questions_sequence.label_en)
        end

        it 'returns no questions sequence with a made up search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: "It's me, Malario" }), context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestionsSequences',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String) {
            getQuestionsSequences(projectId: $projectId, searchTerm: $searchTerm) {
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
