require 'rails_helper'

module Queries
  module Variables
    describe GetVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:variable) { create(:variable) }
        let(:variables) { { id: variable.id } }

        it 'returns a variable' do
          result = RailsGraphqlSchema.execute(
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

          result = RailsGraphqlSchema.execute(
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
