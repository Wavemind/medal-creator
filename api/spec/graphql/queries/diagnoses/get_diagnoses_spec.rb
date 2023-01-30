require 'rails_helper'

describe Queries::Diagnoses::GetDiagnoses, type: :request do
  before(:each) do
    DecisionTree.first.diagnoses.create!(label_en: 'Malaria')
  end
  describe '.resolve' do
    it 'returns every diagnoses of an algorithm' do
      query = <<-GRAPHQL
              query {
                getDiagnoses(algorithmId: #{DecisionTree.first.algorithm_id}, first: 5){
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
      data = json['data']['getDiagnoses']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
        'en' => 'Malaria'
      )
    end

    it 'returns every diagnoses of a decision tree' do
      query = <<-GRAPHQL
              query {
                getDiagnoses(algorithmId: #{DecisionTree.first.algorithm_id}, decisionTreeId: #{DecisionTree.first.id}, first: 5){
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
      data = json['data']['getDiagnoses']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
                                             'en' => 'Malaria'
                                           )
    end

    it 'returns diagnoses with the label matching search term' do
      query = <<-GRAPHQL
        query {
        getDiagnoses(
          algorithmId: #{Algorithm.first.id}
          searchTerm: "aria"
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
      data = json['data']['getDiagnoses']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
         'en' => 'Malaria'
       )
    end
  end
end
