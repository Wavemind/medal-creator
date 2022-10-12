require 'rails_helper'

module Mutations
  module Users
    RSpec.describe UpdateUser, type: :request do
      before(:each) do
        @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                             password_confirmation: '123456')
      end
      describe 'resolve' do
        it 'update a user' do
          post '/graphql', params: { query: query(id: @user.id, last_name: 'Ucak') }

          json = JSON.parse(response.body)
          data = json['data']['updateUser']['user']

          expect(data).to include(
            'id' => @user.id.to_s,
            'firstName' => 'Manu',
            'lastName' => 'Ucak'
          )
        end
      end

      def query(id:, last_name:)
        <<~GQL
          mutation {
            updateUser(input: {params: {id: #{@user.id}, lastName: "Ucak"}}) {
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
