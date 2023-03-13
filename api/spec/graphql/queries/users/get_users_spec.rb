require 'rails_helper'

module Queries
  module Users
    describe GetUsers, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let!(:user) { create(:user) }

        it 'return paginated users' do
          result = RailsGraphqlSchema.execute(
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
          ).to eq(user[:first_name])
        end
      end

      def query
        <<~GQL
          query {
            getUsers {
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
