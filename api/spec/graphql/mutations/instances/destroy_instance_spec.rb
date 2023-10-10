require 'rails_helper'

module Mutations
  module Instances
    describe DestroyInstance, type: :graphql do
      describe '.resolve' do
        it 'Removes instance and conditions / children in cascade' do
          instance = Diagnosis.first.instances.first
          expect do
            ApiSchema.execute(
              query,
              variables: { id: instance.id },
              context: { current_api_v2_user: User.first }
            )
          end.to change { Instance.count }.by(-1).and change{ Condition.count }.by(-2).and change{ Child.count }.by(-2)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyInstance(
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
