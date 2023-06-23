require 'rails_helper'

module Queries
  module Diagnoses
    describe GetDiagnosis, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:diagnosis) { create(:diagnosis) }
        let(:variables) { { id: diagnosis.id } }

        it 'return a diagnosis' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnosis',
              'labelTranslations',
              'en'
            )
          ).to eq(diagnosis.label_translations['en'])
        end

        it 'returns available nodes for the diagram' do
          available_nodes = diagnosis.available_nodes
          Instance.create(node: available_nodes.first, instanceable: diagnosis.decision_tree, diagnosis: diagnosis)

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          new_available_nodes = result.dig('data', 'getDiagnosis', 'availableNodes')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes).not_to include({"id" => available_nodes.first.id.to_s})
          expect(new_available_nodes).to include({"id" => available_nodes.second.id.to_s})
        end

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Diagnosis does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getDiagnosis(id: $id) {
              id
              availableNodes {
                id              
              }
              labelTranslations {
                en
              }
            }
          }
        GQL
      end
    end
  end
end
