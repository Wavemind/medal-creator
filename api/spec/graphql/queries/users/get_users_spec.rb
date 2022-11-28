require 'rails_helper'

describe Queries::Users::GetUsers, type: :request do
  describe '.resolve' do
    before(:each) do
      @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: 'Wavemind2012!',
                           password_confirmation: 'Wavemind2012!')
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
