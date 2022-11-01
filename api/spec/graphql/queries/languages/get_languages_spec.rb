require 'rails_helper'

describe Queries::Languages::GetLanguages, type: :request do
  before(:each) do
    @user = Language.create!(code: 'fr', name: 'French')
  end
  describe '.resolve' do
    it 'returns every users' do
      query = <<-GRAPHQL
            query{
              getLanguages {
                id
                code
                name
              }
            }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getLanguages']
      first_language = data[0]

      expect(first_language['name']).to eq('French')
      expect(first_language['code']).to eq('fr')
    end
  end
end
