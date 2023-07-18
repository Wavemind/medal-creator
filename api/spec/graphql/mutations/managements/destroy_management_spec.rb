require 'rails_helper'

module Mutations
  module Managements
    describe DestroyManagement, type: :graphql do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade' do
          management = Project.first.managements.create!(label_en: 'Test')
          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { id: management.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1)
        end

        it 'Returns error if trying to remove node with instances' do
          result = RailsGraphqlSchema.execute(
            query,
            variables: { id: HealthCares::Management.first.id },
            context: { current_api_v1_user: User.first }
          )

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('This management has instances and cannot be destroyed.')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyManagement(
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
