require 'rails_helper'

module Mutations
  module Users
    describe UnlockUser, type: :graphql do
      describe '.resolve' do
        let(:user) { create(:user) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:variables) { { id: user.id } }

        it 'unlock the user' do
          user.lock_access!
          expect(user.access_locked?).to eq(true)
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          user.reload

          expect(user.access_locked?).to eq(false)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            unlockUser(input: {id: $id}) {
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
