require 'rails_helper'

module Mutations
  module Conditions
    describe DestroyCondition, type: :graphql do
      describe '.resolve' do
        let(:instance) { create(:instance) }
        let(:second_instance) { create(:second_instance) }

        it 'Removes condition and child if not used' do
          first_condition = second_instance.conditions.create(answer: instance.node.answers.first)
          second_condition = second_instance.conditions.create(answer: instance.node.answers.second)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: first_condition.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Condition.count }.by(-1).and change { Child.count }.by(0)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: second_condition.id },
              context: { current_api_v1_user: User.first }
            )
          end.to change { Condition.count }.by(-1).and change { Child.count }.by(-1)
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
