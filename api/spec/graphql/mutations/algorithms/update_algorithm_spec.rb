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
          expect(data['ageLimit']).to eq(7)
          expect(data['ageLimitMessageTranslations']['en']).to eq('Too very old')
          expect(data['descriptionTranslations']['en']).to eq('My algo')
        end
      end

      def query
        <<~GQL
          mutation {
            updateAlgorithm(
              input: {params: {
                id: #{@algorithm.id},
                name: "Updated algorithm name",
                ageLimit: 7,
                ageLimitMessageTranslations: {en: "Too very old"}
                descriptionTranslations: {en: "My algo"}
            }}) {
              algorithm {
                id
                name
                ageLimit
                ageLimitMessageTranslations {
                  en
                }
                descriptionTranslations {
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
