require 'rails_helper'

module Queries
  module QuestionsSequences
    describe GetQuestionsSequence, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:questions_sequence) { create(:questions_sequence) }
        let(:variables) { { id: questions_sequence.id } }

        it 'returns a questions_sequence' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestionsSequence',
              'labelTranslations',
              'en'
            )
          ).to eq(questions_sequence.label_translations['en'])
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('QuestionsSequence does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getQuestionsSequence(id: $id) {
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
