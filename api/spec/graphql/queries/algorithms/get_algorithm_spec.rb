require 'rails_helper'

describe Queries::Algorithms::GetAlgorithm, type: :request do
  describe '.resolve' do
    it 'returns an algorithm' do
      query = <<-GRAPHQL
            query {
              getAlgorithm(id: #{Algorithm.first.id}){
                name
              }
            }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getAlgorithm']

      expect(data['name']).to eq('First algo')
    end
  end
end
