require 'rails_helper'

module Queries
  module Users
    describe GetUser, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:user) { create(:user) }
        let(:variables) { { id: user.id } }

        it 'return a user' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getUser',
              'firstName'
            )
          ).to eq(user[:first_name])
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getUser(id: $id) {
              id
              firstName
              lastName
            }
          }
        GQL
      end
    end
  end
end
