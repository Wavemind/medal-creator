require 'rails_helper'

module Mutations
  module Variables
    describe CreateVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:variable_attributes) { attributes_for(:variables_integer_variable) }
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

        it 'create a variable' do
          result = ''
          expect do
            result = RailsGraphqlSchema.execute(query, variables: variables, context: context)
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

        it 'raises an error if params are invalid' do
          wrong_variables = variables
          wrong_variables[:params][:answerTypeId] = 999

          result = RailsGraphqlSchema.execute(query, variables: wrong_variables, context: context)

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
