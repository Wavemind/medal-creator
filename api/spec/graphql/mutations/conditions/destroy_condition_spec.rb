require 'rails_helper'

module Mutations
  module Conditions
    describe DestroyCondition, type: :graphql do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade' do
          condition = Project.first.conditions.create!(label_en: 'Test')
          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { id: condition.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1)
        end

        it 'Returns error if trying to remove node with instances' do
          result = RailsGraphqlSchema.execute(
            query,
            variables: { id: HealthCares::Condition.first.id },
            context: { current_api_v1_user: User.first }
          )

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('This condition has instances and cannot be destroyed.')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyCondition(
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
