require 'rails_helper'

module Queries
  module Drugs
    describe GetDrugs, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:drug) { create(:drug) }
        let(:variables) { { projectId: drug.project_id } }

        it 'return paginated drugs' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDrugs',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(drug.label_en)
        end

        it 'returns drugs with the name matching search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: drug.label_en }), context: context
          )

          expect(
            result.dig(
              'data',
              'getDrugs',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(drug.label_en)
        end

        it 'returns no drug with a made up search term' do
          result = ApiSchema.execute(
            query, variables: variables.merge({ searchTerm: "It's me, Malario" }), context: context
          )

          expect(
            result.dig(
              'data',
              'getDrugs',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($projectId: ID!, $searchTerm: String) {
            getDrugs(projectId: $projectId, searchTerm: $searchTerm) {
              edges {
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
