require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { create(:algorithm) }
        let(:variables) { { id: algorithm.id } }

        it 'returns an algorithm' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithm',
              'name'
            )
          ).to eq(algorithm.name)
        end

        it 'returns available nodes for the diagram' do
          available_nodes = algorithm.available_nodes
          algorithm.components.create(node: available_nodes.first)

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          new_available_nodes = result.dig('data', 'getAlgorithm', 'availableNodes')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes).not_to include({"id" => available_nodes.first.id.to_s})
          expect(new_available_nodes).to include({"id" => available_nodes.second.id.to_s})
        end

        it 'returns variables used in an algorithm' do
          algorithm.components.create!(node: Node.first)
          dt = algorithm.decision_trees.create!(label_en: 'Test', node: Node.where(type: 'Variables::ComplaintCategory').first)
          dt.components.create!(node: Node.second)

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getAlgorithm',
              'usedVariables'
            )
          ).to eq([Node.first.id, Node.second.id])
        end

        it 'returns a formatted consultation order but store a compressed consultation order in database' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          formatted_order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )
          compressed_order = JSON.parse(algorithm.full_order_json)

          # It should have the same amount of elements even if the format is not the same
          expect(formatted_order.count).to eq(compressed_order.count)
          # The formatted order should have all the keys the front need, including "text"
          expect(formatted_order.find { |el| el['id'] == algorithm.project.nodes.first.id }.has_key?('text')).to eq(true)
          # The order stored in database should not have text key since it is generated before rendering to front
          expect(compressed_order.find { |el| el['id'] == algorithm.project.nodes.first.id }.has_key?('text')).to eq(false)
        end

        it 'Order is updated when a variable is created or destroyed' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )
          order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )
          variable = algorithm.project.variables.create!(type: 'Variables::ComplaintCategory', answer_type_id: 1, label_en: 'Test')

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )
          second_order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )

          expect(second_order.count).to eq(order.count + 1)
          expect(second_order[-1]['id']).to eq(variable.id)

          variable.destroy

          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )
          last_order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )

          expect(order).to eq(last_order)
        end

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Algorithm does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getAlgorithm(id: $id) {
              id
              availableNodes {
                id              
              }
              name
              usedVariables
              formattedConsultationOrder
            }
          }
        GQL
      end
    end
  end
end
