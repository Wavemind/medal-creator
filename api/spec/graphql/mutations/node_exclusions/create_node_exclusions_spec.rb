require 'rails_helper'

module Mutations
  module NodeExclusions
    describe CreateNodeExclusions, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:first_management) { create(:management) }
        let(:second_management) { create(:management) }
        let(:third_management) { create(:management) }

        it 'create 2 exclusions' do
          expect do
            ApiSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
                { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: third_management.id }
              ]},
              context: { current_api_v1_user: User.first }
            )
          end.to change { NodeExclusion.count }.by(2)
        end

        it 'raises an error if nodes are not the same type as the exclusion' do
          result = ApiSchema.execute(
            query,
            variables: { params: [
              { nodeType: 'drug', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
            ]},
            context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])[0]['excluding_node_id'][0]).to eq('This node is not on the same as the exclusion')
          expect(JSON.parse(result['errors'][0]['message'])[0]['excluded_node_id'][0]).to eq('This node is not on the same as the exclusion')
        end

        it 'raises an error if trying to build an existing exclusion', focus: true do
          result = ApiSchema.execute(
            query,
            variables: { params: [
              { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
              { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
            ]},
            context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])[1]['excluded_node_id'][0]).to eq('This exclusion is already set.')
        end

        it 'raises an error if trying to exclude a node by himself' do
          result = ApiSchema.execute(
            query,
            variables: { params: [
              { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: first_management.id },
            ]},
            context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])[0]['base'][0]).to eq('Loop alert: a node cannot exclude itself!')
        end

        it 'raises an error if trying to exclude a node by the one it excludes (loop at one level)', focus: true do
            result = ApiSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
                { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: first_management.id },
              ]},
              context: { current_api_v1_user: User.first }
            )

            expect(result['errors']).not_to be_empty
            expect(JSON.parse(result['errors'][0]['message'])[1]['base'][0]).to eq('Loop alert: a node cannot exclude itself!')
        end

        it 'raises an error if trying to exclude a node by another node it excludes (loop at two levels to test recursive logic)' do
          ApiSchema.execute(
            query,
            variables: { params: [
              { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
              { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: third_management.id },
            ]},
            context: { current_api_v1_user: User.first }
          )

          result = ApiSchema.execute(
            query,
            variables: { params: [
              { nodeType: 'management', excludingNodeId: third_management.id, excludedNodeId: first_management.id },
            ]},
            context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])[0]['base'][0]).to eq('Loop alert: a node cannot exclude itself!')
        end
      end

      def query
        <<~GQL
          mutation($params: [NodeExclusionInput!]!) {
            createNodeExclusions(
              input: {
                params: $params
            }){
              nodeExclusions{
                id
              }
            }
          }
        GQL
      end
    end
  end
end
