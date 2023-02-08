require 'rails_helper'

module Mutations
  module DecisionTrees
    describe UpdateDecisionTree, type: :request do
      before(:each) do
        @decision_tree = Algorithm.first.decision_trees.create!(node: Node.first, label_en: 'Malaria')
      end

      describe '.resolve' do
        it 'returns an updated algorithm' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['updateDecisionTree']['decisionTree']

          expect(data['labelTranslations']['en']).to eq('Severe malaria')
        end
      end

      def query
        <<~GQL
          mutation {
            updateDecisionTree(
              input: {params: {
                id: #{@decision_tree.id},
                labelTranslations: {en: "Severe malaria"}
            }}) {
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
