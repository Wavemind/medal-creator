require 'rails_helper'

module Mutations
  module Diagnoses
    describe CreateDiagnosis, type: :graphql do
      describe '.resolve' do
        it 'create a diagnosis' do
          files = [
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

          result = RailsGraphqlSchema.execute(query, variables: {
                                                params: {
                                                  decisionTreeId: DecisionTree.first.id,
                                                  labelTranslations: { en: 'Severe Pneumonia' },
                                                  descriptionTranslations: { en: 'Severe Pneumonia',
                                                                             fr: 'Pneumonie Severe' },
                                                  levelOfUrgency: 4
                                                },
                                                files: files
                                              }, context: { current_api_v1_user: User.first })

          expect(result.dig('data', 'createDiagnosis', 'diagnosis', 'labelTranslations',
                            'en')).to eq('Severe Pneumonia')
          expect(result.dig('data', 'createDiagnosis', 'diagnosis', 'id')).not_to be_blank
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
