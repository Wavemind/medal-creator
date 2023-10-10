require 'rails_helper'

module Mutations
  module Diagnoses
    describe CreateDiagnosis, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:diagnosis_attributes) { attributes_for(:variables_diagnosis) }
        let(:invalid_diagnosis_attributes) { attributes_for(:variables_diagnosis_invalid) }
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
        let(:variables) { { params: diagnosis_attributes, files: files } }

        it 'create a diagnosis' do
          result = ApiSchema.execute(query, variables: variables, context: context)
          expect(result.dig(
                   'data',
                   'createDiagnosis',
                   'instance',
                   'node',
                   'labelTranslations',
                   'en'
                 )).to eq(diagnosis_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createDiagnosis', 'instance', 'node', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = ApiSchema.execute(
            query, variables: { params: invalid_diagnosis_attributes,
                                files: [] }, context: { current_api_v2_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['level_of_urgency'][0]).to eq('must be less than or equal to 10')
        end
      end

      def query
        <<~GQL
          mutation($params: DiagnosisInput!, $files: [Upload!]) {
            createDiagnosis(
              input: {
                params: $params
                files: $files
              }
            ) {
              instance {
                node {
                  id
                  labelTranslations {
                    en
                  }
                }
              }
            }
          }
        GQL
      end
    end
  end
end
