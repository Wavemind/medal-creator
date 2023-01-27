require 'rails_helper'

describe Queries::DecisionTrees::GetDecisionTree, type: :request do
  describe '.resolve' do
    it 'returns a decision tree' do
      query = <<-GRAPHQL
            query {
              getDecisionTree(id: #{DecisionTree.first.id}){
                labelTranslations {
                  en
                }
              }
            }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getDecisionTree']

      expect(data['labelTranslations']['en']).to eq('Cold')
    end
  end
end
