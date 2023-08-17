require 'rails_helper'

module Mutations
  module Diagnoses
    describe UpdateDiagnosis, type: :graphql do
      describe '.resolve' do
        let(:diagnosis) { create(:diagnosis) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_diagnosis_attributes) { attributes_for(:variables_diagnosis) }
        let(:files) do
          [
            ApolloUploadServer::Wrappers::UploadedFile.new(
              ActionDispatch::Http::UploadedFile.new(
                filename: 'Sandy_Cheeks.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Sandy_Cheeks.png')
              )
            )
          ]
        end
        let(:variables) { { params: new_diagnosis_attributes.merge({ id: diagnosis.id }), files: files } }

        it 'update the diagnosis' do
          ApiSchema.execute(query, variables: variables, context: context)

          diagnosis.reload

          expect(diagnosis.label_translations['en']).to eq(new_diagnosis_attributes[:labelTranslations][:en])
        end

        it 'returns the updated diagnosis' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateDiagnosis',
              'diagnosis',
              'id'
            )
          ).to eq(diagnosis.id.to_s)

          expect(
            result.dig(
              'data',
              'updateDiagnosis',
              'diagnosis',
              'labelTranslations',
              'en'
            )
          ).to eq(new_diagnosis_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: DiagnosisInput!, $files: [Upload!]) {
            updateDiagnosis(
              input: {
                params: $params
                filesToAdd: $files
                existingFilesToRemove: []
              }
            ) {
              diagnosis {
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
