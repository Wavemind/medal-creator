require 'rails_helper'

module Queries
  module Algorithms
    describe GetAlgorithm, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:algorithm) { create(:algorithm) }
        let(:variables) { { id: algorithm.id } }

        it 'returns an algorithm' do
          result = ApiSchema.execute(
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

        it 'ensures available nodes are correct even after creating an instance which would remove the node from the list' do
          available_nodes = algorithm.available_nodes
          algorithm.components.create(node: available_nodes.first)

          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: algorithm.id, instanceableType: algorithm.class.name }, context: context
          )

          new_available_nodes = result.dig('data', 'getAvailableNodes', 'edges')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes.select{|node| node['node']['id'] == available_nodes.first.id.to_s}).not_to be_present
          expect(new_available_nodes.select{|node| node['node']['id'] == available_nodes.second.id.to_s}).to be_present
        end

        it 'ensures available_nodes does not have not usable node types' do
          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: algorithm.id, instanceableType: algorithm.class.name }, context: context
          )

          available_nodes = result.dig('data', 'getAvailableNodes', 'edges')

          expect(available_nodes.select{|node| node['node']['category'] == "VitalSignAnthropometric"}).to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Symptom"}).to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Diagnosis"}).not_to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Drug"}).not_to be_present
        end

        it 'ensures components (instances in diagram) are correct even after creating an instance which would add the node to the list' do
          components_count = algorithm.components.count
          algorithm.components.create(node: Node.first)

          result = ApiSchema.execute(
            components_query, variables: { instanceableId: algorithm.id, instanceableType: algorithm.class.name }, context: context
          )

          new_components = result.dig('data', 'getComponents')

          expect(components_count).to eq(new_components.count - 1)
          expect(new_components.select{|instance| instance["nodeId"] == Node.first.id}).not_to be_present
        end

        it 'returns variables used in an algorithm' do
          algorithm.components.create!(node: Node.first)
          dt = algorithm.decision_trees.create!(label_en: 'Test', node: Node.where(type: 'Variables::ComplaintCategory').first)
          dt.components.create!(node: Node.second)

          result = ApiSchema.execute(
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
          result = ApiSchema.execute(
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
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )
          order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )
          variable = algorithm.project.variables.create!(type: 'Variables::ComplaintCategory', answer_type_id: 1, label_en: 'Test')

          result = ApiSchema.execute(
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

          result = ApiSchema.execute(
            query, variables: variables, context: context
          )
          last_order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )

          expect(order).to eq(last_order)
        end

        it 'Order has BMI by default in it' do
          bmi_variable = algorithm.project.variables.find_by("label_translations -> ? = ?", 'en', 'BMI')
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          order = result.dig(
            'data',
            'getAlgorithm',
            'formattedConsultationOrder'
          )

          expect(order.select { |el| el['id'] == bmi_variable.id }).to be_present
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Algorithm does not exist')
        end
      end

      def available_nodes_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: DiagramEnum!) {
            getAvailableNodes(instanceableId: $instanceableId, instanceableType: $instanceableType) {
              edges {
                node {
                  id
                  category
                }
              }
            }
          }
        GQL
      end

      def components_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: DiagramEnum!) {
            getComponents(instanceableId: $instanceableId, instanceableType: $instanceableType) {
              id
              nodeId
            }
          }
        GQL
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getAlgorithm(id: $id) {
              id
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
