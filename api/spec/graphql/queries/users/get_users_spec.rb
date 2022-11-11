require 'rails_helper'

describe Queries::Users::GetUsers, type: :request do
  before(:each) do
    @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                         password_confirmation: '123456')
  end
  describe '.resolve' do
    it 'returns every users' do
      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getUsers']
      last_user = data[-1]

      expect(last_user['firstName']).to eq('Manu')
      expect(last_user['lastName']).to eq('Girard')
    end
  end

  def query
    <<-GRAPHQL
      query{
        getUsers {
          id
          firstName
          lastName
          email
        }
      }
    GRAPHQL
  end
end
