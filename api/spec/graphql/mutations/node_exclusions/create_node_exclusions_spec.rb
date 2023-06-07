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
            RailsGraphqlSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
                { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: third_management.id }
              ]},
              context: { current_api_v1_user: User.first }
            )
          end.to change { NodeExclusion.count }.by(2)
        end

        it 'raises an error if exclusions are incoherent' do
          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: first_management.id },
              ]},
              context: { current_api_v1_user: User.first }
            )
          end.to raise_error(ActiveRecord::Rollback)

          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
                { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: first_management.id },
              ]},
              context: { current_api_v1_user: User.first }
            )
          end.to raise_error(ActiveRecord::Rollback)

          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: first_management.id, excludedNodeId: second_management.id },
                { nodeType: 'management', excludingNodeId: second_management.id, excludedNodeId: third_management.id },
              ]},
              context: { current_api_v1_user: User.first }
            )


            RailsGraphqlSchema.execute(
              query,
              variables: { params: [
                { nodeType: 'management', excludingNodeId: third_management.id, excludedNodeId: first_management.id },
              ]},
              context: { current_api_v1_user: User.first }
            )
          end.to raise_error(ActiveRecord::Rollback)
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
