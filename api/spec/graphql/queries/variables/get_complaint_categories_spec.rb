require 'rails_helper'

module Queries
  module Variables
    describe GetComplaintCategories, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let!(:complaint_category) { create(:complaint_category) }

        it 'return paginated complaint categories' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getComplaintCategories',
              'edges',
              -1,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(complaint_category.label_translations[:en])
        end
      end

      def query
        <<~GQL
          query {
            getComplaintCategories {
              edges {
                node {
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
