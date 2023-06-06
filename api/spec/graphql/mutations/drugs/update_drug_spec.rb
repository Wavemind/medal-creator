require 'rails_helper'

module Mutations
  module Drugs
    describe UpdateDrug, type: :graphql do
      describe '.resolve' do
        let(:drug) { create(:drug) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_drug_attributes) { attributes_for(:variables_drug) }
        let(:files) do
          [
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Sandy_Cheeks.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Sandy_Cheeks.png')
              )
            )
          ]
        end
        let(:variables) { { params: new_drug_attributes.merge({ id: drug.id }), files: files } }

        it 'update the drug' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          drug.reload

          expect(drug.label_translations['en']).to eq(new_drug_attributes[:labelTranslations][:en])
        end

        it 'returns the updated drug' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateDrug',
              'drug',
              'id'
            )
          ).to eq(drug.id.to_s)

          expect(
            result.dig(
              'data',
              'updateDrug',
              'drug',
              'labelTranslations',
              'en'
            )
          ).to eq(new_drug_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: DrugInput!, $files: [Upload!]) {
            updateDrug(
              input: {
                params: $params
                filesToAdd: $files
                existingFilesToRemove: []
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
