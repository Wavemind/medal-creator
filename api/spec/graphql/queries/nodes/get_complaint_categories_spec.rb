require 'rails_helper'

module Queries
  module Nodes
    describe GetComplaintCategories, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let!(:complaint_category) { create(:complaint_category) }

        it 'return paginated complaint categories' do
          result = RailsGraphqlSchema.execute(
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
          ).to eq(complaint_category[:label_translations][:en])
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
