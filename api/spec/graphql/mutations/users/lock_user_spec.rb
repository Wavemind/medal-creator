require 'rails_helper'

module Mutations
  module Users
    describe LockUser, type: :graphql do
      describe '.resolve' do
        let(:user) { create(:user) }
        let(:context) { { current_api_v2_user: User.first } }
        let(:variables) { { id: user.id } }

        it 'lock the user' do
          ApiSchema.execute(query, variables: variables, context: context)

          user.reload

          expect(user.access_locked?).to eq(true)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            lockUser(input: {id: $id}) {
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
