require 'rails_helper'

module Mutations
  module Users
    describe UpdateUser, type: :request do
      describe '.resolve' do
        it 'create a user' do
          expect do
            post '/graphql',
                 params: { query: query(email: 'quentin.girard@wavemind.ch', first_name: 'Quentin', last_name: 'Ucak',
                                        password: '123456', password_confirmation: '123456') }
          end.to change { User.count }.by(1)
        end

        it 'returns a user' do
          post '/graphql',
               params: { query: query(email: 'quentin.girard@wavemind.ch', first_name: 'Quentin', last_name: 'Ucak',
                                      password: '123456', password_confirmation: '123456') }

          json = JSON.parse(response.body)
          data = json['data']['createUser']['user']

          expect(data).to include(
            'firstName' => 'Quentin',
            'lastName' => 'Ucak'
          )
        end
      end

      def query(email:, first_name:, last_name:, password:, password_confirmation:)
        <<~GQL
          mutation {
            createUser(input: {params: {email: "#{email}", firstName: "#{first_name}", lastName: "#{last_name}", password: "#{password}", passwordConfirmation: "#{password_confirmation}"}}) {
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
