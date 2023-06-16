require 'rails_helper'

module Mutations
  module Conditions
    describe CreateCondition, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:instance) { create(:instance) }
        let(:second_instance) { create(:second_instance) }

        it 'create a condition' do
          result = RailsGraphqlSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          expect(result.dig('data', 'createCondition', 'condition', 'id')).not_to be_blank
        end

        it 'raises an error when trying to create a condition that exists' do
          RailsGraphqlSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          result = RailsGraphqlSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['instance_id'][0]).to eq('is not available')
        end

        it 'raises an error when trying to do a loop with conditions' do
          RailsGraphqlSchema.execute(query, variables: { params: {instanceId: instance.id, answerId: second_instance.node.answers.first.id} }, context: context)
          result = RailsGraphqlSchema.execute(query, variables: { params: {instanceId: second_instance.id, answerId: instance.node.answers.first.id} }, context: context)

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
