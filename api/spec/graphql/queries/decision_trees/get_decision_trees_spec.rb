require 'rails_helper'

describe Queries::DecisionTrees::GetDecisionTrees, type: :request do
  before(:each) do
    Algorithm.first.decision_trees.create!(label_en: 'Malaria', node: Node.first)
  end
  describe '.resolve' do
    it 'returns every algorithms of a project' do
      query = <<-GRAPHQL
              query {
                getDecisionTrees(algorithmId: #{Algorithm.first.id}, first: 5){
                  edges {
                    node {
                      labelTranslations {
                        en
                      }
                    }
                  }
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Malaria'
      )
    end
  end
end
