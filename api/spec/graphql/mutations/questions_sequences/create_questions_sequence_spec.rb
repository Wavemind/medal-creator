require 'rails_helper'

module Mutations
  module QuestionsSequences
    describe CreateQuestionsSequence, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:qs_attributes) { attributes_for(:variable_questions_sequence) }
        let(:invalid_qs_attributes) { attributes_for(:qs_wrong_variables) }
        let(:variables) { { params: qs_attributes } }
        let(:invalid_variables) { { params: invalid_qs_attributes } }

        it 'create a questions sequence' do
          result = ''
          expect do
            result = ApiSchema.execute(query, variables: variables, context: context)
          end.to change { Node.count }.by(1).and change { Answer.count }.by(2)
          expect(result.dig(
                   'data',
                   'createQuestionsSequence',
                   'questionsSequence',
                   'labelTranslations',
                   'en'
                 )).to eq(qs_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createQuestionsSequence', 'questionsSequence', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = ApiSchema.execute(query, variables: invalid_variables, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['min_score'][0]).to eq('must be greater than 0')
        end
      end

      def query
        <<~GQL
          mutation($params: QuestionsSequenceInput!) {
            createQuestionsSequence(
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
