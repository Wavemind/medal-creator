require 'rails_helper'

module Mutations
  module Users
    describe CreateUser, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:user_attributes) { attributes_for(:variables_user, role: 'admin') }
        let(:variables) { { params: user_attributes } }

        it 'create a user' do
          expect do
            RailsGraphqlSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { User.count }.by(1)
        end

        it 'return a user' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'createUser',
              'user',
              'firstName'
            )
          ).to eq(user_attributes[:firstName])
        end
      end

      def query
        <<~GQL
          mutation($params: UserInput!) {
            createUser(input: { params: $params }) {
              user {
                id
                firstName
                lastName
              }
            }
          }
        GQL
      end
    end
  end
end
