require 'rails_helper'

module Mutations
  module Conditions
    describe CreateCondition, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:instance) { create(:instance) }
        let(:second_instance) { create(:second_instance) }

        it 'create a condition' do
          result = ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          expect(result.dig('data', 'createCondition', 'condition', 'id')).not_to be_blank
        end

        it 'creates a condition and the child with it' do
          expect do
            ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          end.to change { Condition.count }.by(1).and change { Child.count }.by(1)

          expect do
            ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.second.id} }, context: context)
          end.to change { Condition.count }.by(1).and change { Child.count }.by(0)
        end

        it 'raises an error when trying to create a condition that exists' do
          ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          result = ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['instance_id'][0]).to eq('is not available')
        end

        it 'raises an error when trying to do a loop with conditions' do
          ApiSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          result = ApiSchema.execute(query, variables: { params: {instanceId: second_instance.id, answerId: instance.node.answers.first.id} }, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['base'][0]).to eq('You are trying to do a loop in your diagnosis. This is impossible.')
        end
      end

      def query
        <<~GQL
          mutation($params: ConditionInput!) {
            createCondition(
              input: {
                params: $params
              }
            ) {
              condition {
                id
              }
            }
          }
        GQL
      end
    end
  end
end
