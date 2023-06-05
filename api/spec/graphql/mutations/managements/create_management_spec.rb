require 'rails_helper'

module Mutations
  module Managements
    describe CreateManagement, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:management_attributes) { attributes_for(:variables_management) }
        let(:invalid_management_attributes) { attributes_for(:variables_management_invalid) }
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
        let(:variables) { { params: management_attributes, files: files } }

        it 'create a management' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)
          expect(result.dig(
                   'data',
                   'createManagement',
                   'management',
                   'labelTranslations',
                   'en'
                 )).to eq(management_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createManagement', 'management', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = RailsGraphqlSchema.execute(
            query, variables: { params: invalid_management_attributes,
                                files: [] }, context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['level_of_urgency'][0]).to eq('must be less than or equal to 10')
        end
      end

      def query
        <<~GQL
          mutation($params: ManagementInput!, $files: [Upload!]) {
            createManagement(
              input: {
                params: $params
                files: $files
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
