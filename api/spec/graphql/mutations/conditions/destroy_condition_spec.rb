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
              context: { current_api_v2_user: User.first }
            )
          end.to change { Condition.count }.by(-1).and change { Child.count }.by(0)

          expect do
            ApiSchema.execute(
              query,
              variables: { id: second_condition.id },
              context: { current_api_v2_user: User.first }
            )
          end.to change { Condition.count }.by(-1).and change { Child.count }.by(-1)
        end

        it 'Returns an error if trying to destroy condition that does not exist' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: { current_api_v2_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Condition does not exist')
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
