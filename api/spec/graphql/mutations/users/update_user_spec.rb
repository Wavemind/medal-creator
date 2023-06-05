require 'rails_helper'

module Mutations
  module Users
    describe UpdateUser, type: :graphql do
      describe '.resolve' do
        let(:user) { create(:user) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_user_attributes) { attributes_for(:variables_user) }
        let(:variables) { { params: new_user_attributes.merge({ id: user.id }) } }

        it 'updates the user' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          user.reload

          expect(user.first_name).to eq(new_user_attributes[:firstName])
          expect(user.last_name).to eq(new_user_attributes[:lastName])
        end

        it 'returns the updated user' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)


          expect(
            result.dig(
              'data',
              'updateUser',
              'user',
              'id'
            )
          ).to eq(user.id.to_s)

          expect(
            result.dig(
              'data',
              'updateUser',
              'user',
              'firstName'
            )
          ).to eq(new_user_attributes[:firstName])
        end
      end

      def query
        <<~GQL
          mutation($params: UserInput!) {
            updateUser(input: { params: $params }) {
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
