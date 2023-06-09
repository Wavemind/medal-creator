require 'rails_helper'

module Queries
  module Users
    describe GetUser, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:user) { create(:user) }
        let(:variables) { { id: user.id } }

        it 'return a user' do
          result = ApiSchema.execute(
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

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('User does not exist')
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
