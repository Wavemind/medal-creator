require 'rails_helper'

describe Queries::Users::GetUser, type: :request do
  before(:each) do
    @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: ENV['USER_DEFAULT_PASSWORD'],
                         password_confirmation: ENV['USER_DEFAULT_PASSWORD'])
  end
  describe '.resolve' do
    it 'returns a user' do
      query = <<-GRAPHQL
            query{
              getUser(id: #{@user.id}){
                firstName
                lastName
              }
            }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getUser']

      expect(data).to include(
        'firstName' => 'Manu',
        'lastName' => 'Girard'
      )
    end
  end
end
