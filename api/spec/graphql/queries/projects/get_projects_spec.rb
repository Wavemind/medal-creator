require 'rails_helper'

module Queries
  module Projects
    describe GetProjects, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let!(:project) { create(:project) }

        it 'return paginated projects' do
          result = RailsGraphqlSchema.execute(
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

        it 'returns projects with the name matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: { searchTerm: project.name }, context: context
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
          ).to eq(project.name)
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
