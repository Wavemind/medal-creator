require 'rails_helper'

module Queries
  module Nodes
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

          expect(
            result.dig(
              'data',
              'getVariable',
              'dependencies'
            )
          ).to include(decision_tree.reference_label)
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
              dependencies
            }
          }
        GQL
      end
    end
  end
end
