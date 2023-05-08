require 'rails_helper'

module Mutations
  module Variables
    describe DestroyVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:variable) { create(:variable) }

        it 'Removes variable and its answers' do
          variable.reload # Reload the variable since it is created out of the 'it' block (and so is not considered by the database)

          expect do
            RailsGraphqlSchema.execute(
              query,
              variables: { id: variable.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1).and change { Answer.count }.by(-2)
        end

        it 'Returns error if trying to remove node with instances' do
          variable.project.algorithms.first.components.create!(node: variable)

          result = RailsGraphqlSchema.execute(
            query,
            variables: { id: variable.id },
            context: { current_api_v1_user: User.first }
          )

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('This variable has instances and cannot be destroyed.')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyVariable(
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
