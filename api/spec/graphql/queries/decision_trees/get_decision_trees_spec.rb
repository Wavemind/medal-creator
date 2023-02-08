require 'rails_helper'

describe Queries::DecisionTrees::GetDecisionTrees, type: :request do
  before(:each) do
    Algorithm.first.decision_trees.create!(label_en: 'Malaria', node: Node.first)
  end
  describe '.resolve' do
    it 'returns every decision trees of an algorithm' do
      post '/graphql', params: { query: query(search_term: '') }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Malaria'
      )
    end

    it 'returns decision trees with the label matching search term' do
      post '/graphql', params: { query: query(search_term: 'Cold') }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Cold'
      )
    end

    it 'returns decision trees with the label of a diagnosis matching search term' do
      post '/graphql', params: { query: query(search_term: 'Diarrhea') }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Cold'
      )
    end
  end

  def query(search_term:)
    <<-GRAPHQL
        query {
        getDecisionTrees(
          algorithmId: #{Algorithm.first.id}
          searchTerm: "#{search_term}"
        ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
            totalCount
            edges {
              node {
                id
                labelTranslations {
                  en
                }
              }
              node {
                labelTranslations {
                  en
                }
              }
            }
          }
        }
    GRAPHQL
  end
end
