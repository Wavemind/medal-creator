require 'rails_helper'

module Mutations
  module Variables
    describe UpdateVariable, type: :graphql do
      describe '.resolve' do
        let(:variable) { create(:variable) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_variable_attributes) { attributes_for(:variables_integer_variable) }
        let(:files) do
          [
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Sandy_Cheeks.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Sandy_Cheeks.png')
              )
            )
          ]
        end
        let(:variables) { { params: new_variable_attributes.merge({ id: variable.id }), files: files } }

        it 'update the variable' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          variable.reload

          expect(variable.label_translations['en']).to eq(new_variable_attributes[:labelTranslations][:en])
        end

        it 'returns the updated variable' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateVariable',
              'variable',
              'id'
            )
          ).to eq(variable.id.to_s)

          expect(
            result.dig(
              'data',
              'updateVariable',
              'variable',
              'labelTranslations',
              'en'
            )
          ).to eq(new_variable_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: VariableInput!, $files: [Upload!]) {
            updateVariable(
              input: {
                params: $params
                filesToAdd: $files
                existingFilesToRemove: []
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
