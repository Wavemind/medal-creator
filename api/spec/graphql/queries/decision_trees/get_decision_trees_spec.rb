require 'rails_helper'

describe Queries::DecisionTrees::GetDecisionTrees, type: :request do
  before(:each) do
    Algorithm.first.decision_trees.create!(label_en: 'Malaria', node: Node.first)
  end
  describe '.resolve' do
    it 'returns every decision trees of an algorithm' do
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

    it 'returns decision trees with the label matching search term' do
      query = <<-GRAPHQL
        query {
        getDecisionTrees(
          algorithmId: #{Algorithm.first.id}
          searchTerm: "Col"
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
      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Cold'
      )
    end

    it 'returns a decision tree based on diagnose label' do
      query = <<-GRAPHQL
        query {
        getDecisionTrees(
          algorithmId: #{Algorithm.first.id}
          searchTerm: "Diarrhea"
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
      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTrees']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'HIV'
      )
    end
  end
end
