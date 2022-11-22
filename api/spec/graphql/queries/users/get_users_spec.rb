require 'rails_helper'

describe Queries::Users::GetUsers, type: :request do
  describe '.resolve' do
    before(:each) do
      @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                           password_confirmation: '123456')
    end

    it 'returns every users' do
      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getUsers']

      expect(data).to include(
        'firstName' => 'Manu',
        'lastName' => 'Girard'
      )
    end
  end

  def query
    <<-GRAPHQL
      query{
        getUsers {
          firstName
          lastName
        }
      }
    GRAPHQL
  end
end
