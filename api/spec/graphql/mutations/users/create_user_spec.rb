require 'rails_helper'

module Mutations
  module Users
    describe CreateUser, type: :request do
      describe '.resolve' do
        it 'create a user' do
          expect do
            post '/graphql',
                 params: { query: query(email: 'quentin.ucak@wavemind.ch', first_name: 'Quentin', last_name: 'Ucak',
                                        password: ENV['USER_DEFAULT_PASSWORD'], password_confirmation: ENV['USER_DEFAULT_PASSWORD']) }
          end.to change { User.count }.by(1)
        end

        it 'returns a user' do
          post '/graphql',
               params: { query: query(email: 'quentin.ucak@wavemind.ch', first_name: 'Quentin', last_name: 'Ucak',
                                      password: ENV['USER_DEFAULT_PASSWORD'], password_confirmation: ENV['USER_DEFAULT_PASSWORD']) }

          json = JSON.parse(response.body)
          data = json['data']['createUser']['user']

          expect(data['firstName']).to eq('Quentin')
          expect(data['lastName']).to eq('Ucak')
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
