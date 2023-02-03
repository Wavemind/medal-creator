require 'rails_helper'

module Mutations
  module DecisionTrees
    describe CreateDecisionTree, type: :request do
      describe '.resolve' do
        it 'creates a decision tree' do
          expect do
            post '/graphql',
                 params: { query: query }
          end.to change { DecisionTree.count }.by(1)
        end

        it 'returns a decision tree' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['createDecisionTree']['decisionTree']
          expect(data['labelTranslations']['en']).to eq('Pneumonia')
        end
      end

      def query
        <<~GQL
          mutation {
            createDecisionTree(input: {params: {algorithmId: #{Algorithm.first.id}, labelTranslations: {en: "Pneumonia"}, nodeId: #{Node.first.id}}}) {
              decisionTree {
                id
                labelTranslations {
                  en
                }
              }
            }
          }
        GQL
      end
    end
  end
end
