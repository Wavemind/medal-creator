require 'rails_helper'

module Mutations
  module Algorithms
    describe ImportTranslations, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:wrong_translation_file) do
          ApolloUploadServer::Wrappers::UploadedFile.new(
            ActionDispatch::Http::UploadedFile.new(
              filename: 'Patrick_Star.png', type: 'image/png', tempfile: File.new('spec/fixtures/files/Patrick_Star.png')
            )
          )
        end
        let(:wrong_variables) { { id: Algorithm.first.id, translationsFile: wrong_translation_file } }

        it 'Import translations with correct file' do
          export = ApiSchema.execute(
            export_translations_query, variables: { id: Algorithm.first.id, exportType: 'translations' }, context: context
          )

          url = export.dig(
            'data',
            'exportData',
            'url'
          )

          file_name = url.split('/').last

          upload_file = ApolloUploadServer::Wrappers::UploadedFile.new(
            ActionDispatch::Http::UploadedFile.new(
              filename: file_name, type: 'application/excel', tempfile: File.new("public/exports/#{file_name}")
            )
          )
          algo = Algorithm.first
          dt = algo.decision_trees.first
          old_algo_desc_en = algo.description_en
          old_algo_age_msg_en = algo.age_limit_message_en
          old_dt_l_en = dt.label_en
          old_dt_l_fr = dt.label_fr

          algo.update!(description_en: 'TEST', age_limit_message_en: 'OSTERONE')
          dt.update!(label_en: 'My new label', label_fr: 'Mon nouveau label')

          ApiSchema.execute(
            query, variables: { id: Algorithm.first.id, translationsFile: upload_file }, context: context
          )

          algo.reload
          dt.reload

          expect(algo.description_en).to eq(old_algo_desc_en)
          expect(algo.age_limit_message_en).to eq(old_algo_age_msg_en)
          expect(dt.label_en).to eq(old_dt_l_en)
          expect(dt.label_fr).to eq(old_dt_l_fr)
        end

        it 'Raises error when importing an image instead of excel file' do
          result = ApiSchema.execute(
            query, variables: wrong_variables, context: context
          )

          expect(result['errors'][0]['message']).to eq("File must be in .xls or .xlsx format")
        end
      end

      def export_translations_query
        <<~GQL
          query ($id: ID!, $exportType: String!) {
            exportData(id: $id, exportType: $exportType) {
              success
              url
            }
          }
        GQL
      end

      def query
        <<~GQL
          mutation($id: ID!, $translationsFile: Upload!) {
            importTranslations(input: { id: $id, translationsFile: $translationsFile }) {
              id
            }
          }
        GQL
      end
    end
  end
end
