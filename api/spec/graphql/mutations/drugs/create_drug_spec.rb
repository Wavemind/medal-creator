require 'rails_helper'

module Mutations
  module Drugs
    describe CreateDrug, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:drug_attributes) { attributes_for(:variables_drug) }
        let(:invalid_drug_attributes) { attributes_for(:variables_drug_invalid) }
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
        let(:variables) { { params: drug_attributes, files: files } }

        it 'create a drug' do
          result = ''
          expect do
            result = RailsGraphqlSchema.execute(query, variables: variables, context: context)
          end.to change { Node.count }.by(1).and change { Formulation.count }.by(1).and change { ActiveStorage::Attachment.count }.by(2)
          expect(result.dig(
                   'data',
                   'createDrug',
                   'drug',
                   'labelTranslations',
                   'en'
                 )).to eq(drug_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createDrug', 'drug', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = RailsGraphqlSchema.execute(
            query, variables: { params: invalid_drug_attributes,
                                files: [] }, context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['level_of_urgency'][0]).to eq('must be less than or equal to 10')
        end
      end

      def query
        <<~GQL
          mutation($params: DrugInput!, $files: [Upload!]) {
            createDrug(
              input: {
                params: $params
                files: $files
              }
            ) {
              drug {
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
