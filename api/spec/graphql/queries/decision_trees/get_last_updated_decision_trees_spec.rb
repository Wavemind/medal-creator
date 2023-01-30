require 'rails_helper'

describe Queries::DecisionTrees::GetLastUpdatedDecisionTrees, type: :request do
  before(:each) do
    @decision_tree = Algorithm.first.decision_trees.create!(label_en: 'Last updated', node: Node.first)
  end
  describe '.resolve' do
    it 'returns every algorithms of a project' do
      query = <<-GRAPHQL
              query {
                getLastUpdatedDecisionTrees(projectId: #{Algorithm.first.project_id}, first: 5){
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
      data = json['data']['getLastUpdatedDecisionTrees']['edges'][0]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Last updated'
      )
    end
  end
end
