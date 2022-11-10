require 'rails_helper'

module Mutations
  module Algorithms
    describe UpdateAlgorithm, type: :request do
      before(:each) do
        @algorithm = Project.first.algorithms.create!(name: "Algorithm name", description_en: "My algorithm", age_limit_message_en: "Too old", age_limit: 5)
      end

      describe '.resolve' do

        it 'returns an updated algorithm' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['updateAlgorithm']['algorithm']

          expect(data['name']).to eq('Updated algorithm name')
        end
      end

      def query
        <<~GQL
          mutation {
            updateAlgorithm(input: {params: {id: #{@algorithm.id}, name: "Updated algorithm name"}}) {
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
