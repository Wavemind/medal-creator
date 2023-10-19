require 'rails_helper'

module Mutations
  module Variables
    describe CreateVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:variable_attributes) { attributes_for(:variables_integer_variable) }
        let(:formula_variable_attributes) { attributes_for(:variables_formula_variable) }
        let(:files) do
          [
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Sandy_Cheeks.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Sandy_Cheeks.png')
              )
            ),
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Patrick_Star.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Patrick_Star.png')
              )
            )
          ]
        end
        let(:variables) { { params: variable_attributes, files: files } }
        let(:unavailable_variables) { { params: variable_attributes.merge({isUnavailable: true}), files: files } }

        it 'create a variable' do
          result = ''
          expect do
            result = ApiSchema.execute(query, variables: variables, context: context)
          end.to change { Node.count }.by(1).and change { Answer.count }.by(3).and change { ActiveStorage::Attachment.count }.by(2)
          expect(result.dig(
                   'data',
                   'createVariable',
                   'variable',
                   'labelTranslations',
                   'en'
                 )).to eq(variable_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createVariable', 'variable', 'id')).not_to be_blank
        end

        it 'create a variable with unavailable answer' do
          result = ''
          expect do
            result = ApiSchema.execute(query, variables: unavailable_variables, context: context)
          end.to change { Node.count }.by(1).and change { Answer.count }.by(4).and change { ActiveStorage::Attachment.count }.by(2)

          unavailable_answer = Node.last.answers.find_by(reference: 0)

          expect(unavailable_answer).not_to be_nil
          expect(unavailable_answer.value).to eq('not_available')

          expect(result.dig(
            'data',
            'createVariable',
            'variable',
            'labelTranslations',
            'en'
          )).to eq(variable_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createVariable', 'variable', 'id')).not_to be_blank
        end

        it 'validates formula correctly' do
          result = ApiSchema.execute(query, variables: { params: formula_variable_attributes.merge(formula: '{ToDay}'), files: files }, context: context)
          expect(JSON.parse(result['errors'][0]['message'])['formula'][0]).to eq("You're trying to use a function {ToDay} as a cut-off from the birth date. This is not allowed anymore.")
        end

        it 'raises an error if params are invalid' do
          wrong_variables = variables
          wrong_variables[:params][:answerTypeId] = 999

          result = ApiSchema.execute(query, variables: wrong_variables, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['answer_type'][0]).to eq('must exist')
        end
      end

      def query
        <<~GQL
          mutation($params: VariableInput!, $files: [Upload!]) {
            createVariable(
              input: {
                params: $params
                files: $files
              }
            ) {
              variable {
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
