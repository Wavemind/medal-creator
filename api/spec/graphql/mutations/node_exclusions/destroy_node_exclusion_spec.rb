require 'rails_helper'

module Mutations
  module NodeExclusions
    describe DestroyNodeExclusion, type: :graphql do
      describe '.resolve' do
        it 'Removes instance and conditions / children in cascade' do
          first_drug = Project.first.drugs.first
          second_drug = Project.first.drugs.second
          NodeExclusion.create(excluding_node: first_drug, excluded_node: second_drug, node_type: 'drug')

          expect do
            ApiSchema.execute(
              query,
              variables: { excludingNodeId: first_drug.id, excludedNodeId: second_drug.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { NodeExclusion.count }.by(-1)
        end

        it 'Removes instance and conditions / children in cascade' do
          first_drug = Project.first.drugs.first
          second_drug = Project.first.drugs.second
          NodeExclusion.create(excluding_node: first_drug, excluded_node: second_drug, node_type: 'drug')

          result = ApiSchema.execute(
            query,
            variables: { excludingNodeId: first_drug.id, excludedNodeId: first_drug.id },
            context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('NodeExclusion does not exist')
        end
      end

      def query
        <<~GQL
          mutation($excludingNodeId: ID!, $excludedNodeId: ID!) {
            destroyNodeExclusion(
              input: {
                excludingNodeId: $excludingNodeId
                excludedNodeId: $excludedNodeId
            }){
              id
            }
          }
        GQL
      end
    end
  end
end
