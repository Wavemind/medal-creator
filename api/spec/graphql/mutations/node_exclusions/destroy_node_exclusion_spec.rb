require 'rails_helper'

module Mutations
  module Instances
    describe DestroyInstance, type: :graphql do
      describe '.resolve' do
        it 'Removes instance and conditions / children in cascade' do
          first_drug = Project.first.drugs.first
          second_drug = Project.first.drugs.second
          node_exclusion = NodeExclusion.create(excluding_node: first_drug, excluded_node: second_drug, node_type: 'drug')

          expect do
            ApiSchema.execute(
              query,
              variables: { id: node_exclusion.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { NodeExclusion.count }.by(-1)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyNodeExclusion(
              input: {
                id: $id
            }){
              id
            }
          }
        GQL
      end
    end
  end
end
