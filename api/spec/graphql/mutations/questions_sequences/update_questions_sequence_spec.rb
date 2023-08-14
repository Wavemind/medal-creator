require 'rails_helper'

module Mutations
  module QuestionsSequences
    describe UpdateQuestionsSequence, type: :graphql do
      describe '.resolve' do
        let(:questions_sequence) { create(:questions_sequence) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_questions_sequence_attributes) { attributes_for(:variable_questions_sequence) }
        let(:variables) { { params: new_questions_sequence_attributes.merge({ id: questions_sequence.id }) } }

        it 'update the questions sequence' do
          ApiSchema.execute(query, variables: variables, context: context)

          questions_sequence.reload

          expect(questions_sequence.label_translations['en']).to eq(new_questions_sequence_attributes[:labelTranslations][:en])
        end

        it 'returns the updated questions sequence' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateQuestionsSequence',
              'questionsSequence',
              'id'
            )
          ).to eq(questions_sequence.id.to_s)

          expect(
            result.dig(
              'data',
              'updateQuestionsSequence',
              'questionsSequence',
              'labelTranslations',
              'en'
            )
          ).to eq(new_questions_sequence_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: QuestionsSequenceInput!) {
            updateQuestionsSequence(
              input: {
                params: $params
              }
            ) {
              questionsSequence {
                id
                labelTranslations {
                  en
                }
              }
            }
          }
        GQL
      end
    end
  end
end
