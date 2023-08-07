require 'rails_helper'

module Queries
  module QuestionsSequences
    describe GetQuestionsSequence, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:questions_sequence) { create(:questions_sequence) }
        let(:variables) { { id: questions_sequence.id } }

        it 'returns a questions_sequence' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getQuestionsSequence',
              'labelTranslations',
              'en'
            )
          ).to eq(questions_sequence.label_translations['en'])
        end

        it 'ensures available nodes are correct even after creating an instance which would remove the node from the list' do
          available_nodes = questions_sequence.available_nodes
          questions_sequence.components.create(node: available_nodes.first)

          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: questions_sequence.id, instanceableType: 'QuestionsSequence' }, context: context
          )

          new_available_nodes = result.dig('data', 'getAvailableNodes', 'edges')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes.select{|node| node['node']['id'] == available_nodes.first.id.to_s}).not_to be_present
          expect(new_available_nodes.select{|node| node['node']['id'] == available_nodes.second.id.to_s}).to be_present
        end

        it 'ensures available_nodes does not have not usable node types' do
          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: questions_sequence.id, instanceableType: 'QuestionsSequence' }, context: context
          )

          available_nodes = result.dig('data', 'getAvailableNodes', 'edges')

          expect(available_nodes.select{|node| node['node']['category'] == "VitalSignAnthropometric"}).not_to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Symptom"}).to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Diagnosis"}).not_to be_present
          expect(available_nodes.select{|node| node['node']['category'] == "Drug"}).not_to be_present
        end

        it 'ensures components (instances in diagram) are correct even after creating an instance which would add the node to the list' do
          components_count = questions_sequence.components.count
          questions_sequence.components.create(node: Node.first)

          result = ApiSchema.execute(
            components_query, variables: { instanceableId: questions_sequence.id, instanceableType: 'QuestionsSequence' }, context: context
          )

          new_components = result.dig('data', 'getComponents')

          expect(components_count).to eq(new_components.count - 1)
          expect(new_components.select{|instance| instance["nodeId"] == Node.first.id}).not_to be_present
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('QuestionsSequence does not exist')
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
            getQuestionsSequence(id: $id) {
              id
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
