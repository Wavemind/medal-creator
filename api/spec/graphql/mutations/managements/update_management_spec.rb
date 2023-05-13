require 'rails_helper'

module Mutations
  module Managements
    describe UpdateManagement, type: :graphql do
      describe '.resolve' do
        let(:management) { create(:management) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_management_attributes) { attributes_for(:variables_management) }
        let(:files) do
          [
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Sandy_Cheeks.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Sandy_Cheeks.png')
              )
            )
          ]
        end
        let(:variables) { { params: new_management_attributes.merge({ id: management.id }), files: files } }

        it 'update the management' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          management.reload

          expect(management.label_translations['en']).to eq(new_management_attributes[:labelTranslations][:en])
        end

        it 'returns the updated management' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateManagement',
              'management',
              'id'
            )
          ).to eq(management.id.to_s)

          expect(
            result.dig(
              'data',
              'updateManagement',
              'management',
              'labelTranslations',
              'en'
            )
          ).to eq(new_management_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: ManagementInput!, $files: [Upload!]) {
            updateManagement(
              input: {
                params: $params
                filesToAdd: $files
                existingFilesToRemove: []
              }
            ) {
              management {
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
