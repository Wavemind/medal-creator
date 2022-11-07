require 'rails_helper'

describe Queries::Algorithms::GetAlgorithms, type: :request do
  before(:each) do
    Project.first.algorithms.create!(name: 'My new tested algo', age_limit: 5, age_limit_message_en: 'Message', description_en: 'Desc')
  end
  describe '.resolve' do
    it 'returns every algorithms of a project' do
      query = <<-GRAPHQL
              query {
                getAlgorithms(projectId: #{Project.first.id}){
                  name
                  ageLimit
                  ageLimitMessageTranslations {
                    en
                  }
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getAlgorithms']
      last_algo = data[-1]

      expect(last_algo['name']).to eq('My new tested algo')
      expect(last_algo['ageLimit']).to eq(5)
      expect(last_algo['ageLimitMessageTranslations']['en']).to eq('Message')
    end
  end
end