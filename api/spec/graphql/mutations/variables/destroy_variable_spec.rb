require 'rails_helper'

module Mutations
  module Variables
    describe DestroyVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:variable) { create(:variable) }
        let(:complaint_category) { create(:complaint_category) }

        it 'Removes variable and its answers' do
          variable.reload # Reload the variable since it is created out of the 'it' block (and so is not considered by the database)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: variable.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1).and change { Answer.count }.by(-2)
        end

        it 'Removes a node and the NodeComplaintCategories associated with it' do
          NodeComplaintCategory.create!(complaint_category: complaint_category, node: variable)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: variable.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1).and change { Answer.count }.by(-2).and change { NodeComplaintCategory.count }.by(-1)
        end

        it 'Removes a complaint category and the NodeComplaintCategories associated with it' do
          NodeComplaintCategory.create!(complaint_category: complaint_category, node: variable)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: complaint_category.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1).and change { Answer.count }.by(-2).and change { NodeComplaintCategory.count }.by(-1)
        end

        it 'Returns error if trying to remove node with instances' do
          variable.project.algorithms.first.components.create!(node: variable)

          result = ApiSchema.execute(
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
