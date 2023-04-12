require 'rails_helper'

module Queries
  module Projects
    describe GetProjects, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let!(:project) { create(:project) }

        it 'return paginated projects' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getProjects',
              'edges',
              -1,
              'node',
              'name'
            )
          ).to eq(project[:name])
        end
      end

      def query
        <<~GQL
          query {
            getProjects {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        GQL
      end
    end
  end
end
