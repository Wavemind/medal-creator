require 'rails_helper'

module Mutations
  module Diagnoses
    describe DestroyDiagnosis, type: :graphql do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade' do
          expect do
            response = RailsGraphqlSchema.execute(
              query,
              variables: { id: Diagnosis.first.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Node.count }.by(-1)
             .and change { Instance.count }.by(-4)
             .and change { Condition.count }.by(-6)
             .and change { Child.count }.by(-5)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyDiagnosis(
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
