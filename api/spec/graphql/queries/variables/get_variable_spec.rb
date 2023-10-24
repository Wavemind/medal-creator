require 'rails_helper'

module Queries
  module Variables
    describe GetVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:variable) { create(:variable) }
        let(:variables) { { id: variable.id } }

        it 'returns a variable' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getVariable',
              'labelTranslations',
              'en'
            )
          ).to eq(variable.label_translations['en'])
        end

        it 'returns a variable dependencies' do
          decision_tree = DecisionTree.first
          decision_tree.components.create!(node: variable)

          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          first_algo = result.dig(
            'data',
            'getVariable',
            'dependenciesByAlgorithm',
            0
          )
          expect(first_algo[:title]).to eq(decision_tree.algorithm.name)
          expect(first_algo[:dependencies][0][:label]).to eq(decision_tree.reference_label)
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Variable does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getVariable(id: $id) {
              id
              labelTranslations {
                en
              }
              dependenciesByAlgorithm
            }
          }
        GQL
      end
    end
  end
end
