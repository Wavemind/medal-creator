require 'rails_helper'

module Queries
  module Users
    describe GetUsers, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }

        it 'return paginated users' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getUsers',
              'edges',
              -1,
              'node',
              'firstName'
            )
          ).to eq(User.order(:last_name).last.first_name)
        end

        it 'returns users with the name matching search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: { searchTerm: User.first.first_name }, context: context
          )

          expect(
            result.dig(
              'data',
              'getUsers',
              'edges',
              0,
              'node',
              'firstName'
            )
          ).to eq(User.first.first_name)
        end

        it 'returns no user with a made up search term' do
          result = RailsGraphqlSchema.execute(
            query, variables: { searchTerm: "It's me, Malario" }, context: context
          )

          expect(
            result.dig(
              'data',
              'getUsers',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($searchTerm: String) {
            getUsers(searchTerm: $searchTerm) {
              edges {
                node {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        GQL
      end
    end
  end
end
