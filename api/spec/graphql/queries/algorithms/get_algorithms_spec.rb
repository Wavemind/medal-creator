require 'rails_helper'

describe Queries::Algorithms::GetAlgorithms, type: :request do
  before(:each) do
    @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                         password_confirmation: '123456')
  end
  describe '.resolve' do
    it 'returns every users' do
      query = <<-GRAPHQL
              query {
                getAlgorithms(projectId: 1){
                  name
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getUsers']
      first_user = data[1]

      expect(first_user['firstName']).to eq('Manu')
      expect(first_user['lastName']).to eq('Girard')
    end
  end
end