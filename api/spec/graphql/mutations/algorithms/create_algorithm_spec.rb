require 'rails_helper'

module Mutations
  module Algorithms
    describe CreateAlgorithm, type: :request do
      describe '.resolve' do
        it 'creates a algorithm' do
          expect do
            post '/graphql',
                 params: { query: query }
          end.to change { Algorithm.count }.by(1)
        end

        it 'returns a algorithm' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['createAlgorithm']['algorithm']
          expect(data['name']).to eq('New algorithm')
        end
      end

      def query
        <<~GQL
          mutation {
            createAlgorithm(input: {params: {projectId: #{Project.first.id} name: "New algorithm", ageLimit: 5, descriptionTranslations: {en: "This is a new Algorithm", fr: "Ceci est un nouveau algorithme"}, ageLimitMessageTranslations: {en: "You are too old", fr: "Vous êtes trop vieux"}}}) {
              algorithm {
                id
                name
              }
            }
          }
        GQL
      end
    end
  end
end
