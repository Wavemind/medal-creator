require 'rails_helper'

describe Queries::Algorithms::GetAlgorithm, type: :request do
  before(:each) do
    @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                         password_confirmation: '123456')
  end
  describe '.resolve' do
    it 'returns a user' do
      query = <<-GRAPHQL
            query {
              getAlgorithm(id: 1){
                name
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
