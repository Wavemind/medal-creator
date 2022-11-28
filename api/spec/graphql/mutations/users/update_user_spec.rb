require 'rails_helper'

module Mutations
  module Users
    describe UpdateUser, type: :request do
      describe '.resolve' do
        it 'update a user' do
          user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: 'Wavemind2012!',
                              password_confirmation: 'Wavemind2012!')

          post '/graphql', params: { query: query(id: user.id, last_name: 'Ucak') }

          expect(user.reload).to have_attributes(
            'first_name' => 'Manu',
            'last_name' => 'Ucak'
          )
        end

        it 'returns a user' do
          user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'jean.neige@wavemind.ch', password: 'Wavemind2012!',
                              password_confirmation: 'Wavemind2012!')

          post '/graphql', params: { query: query(id: user.id, last_name: 'Ucak') }

          json = JSON.parse(response.body)
          data = json['data']['updateUser']['user']

          expect(data).to include(
            'id' => user.id.to_s,
            'firstName' => 'Manu',
            'lastName' => 'Ucak'
          )
        end
      end

      def query(id:, last_name:)
        <<~GQL
          mutation {
            updateUser(input: {params: {id: #{id}, lastName: "#{last_name}"}}) {
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
