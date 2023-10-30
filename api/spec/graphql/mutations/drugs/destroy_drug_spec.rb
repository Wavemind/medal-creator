require 'rails_helper'

module Mutations
  module Drugs
    describe DestroyDrug, type: :graphql do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade' do
          drug = Project.first.drugs.create!(label_en: 'Test')
          expect do
            ApiSchema.execute(
              query,
              variables: { id: drug.id },
              context: { current_api_v2_user: User.first }
            )
          end.to change { Node.count }.by(-1)
        end

        it 'Returns error if trying to remove node with instances' do
          result = ApiSchema.execute(
            query,
            variables: { id: HealthCares::Drug.first.id },
            context: { current_api_v2_user: User.first }
          )

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('This drug has instances and cannot be destroyed.')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyDrug(
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
