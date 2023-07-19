require 'rails_helper'

module Mutations
  module Conditions
    describe UpdateCondition, type: :graphql do
      describe '.resolve' do
        let(:condition) { Condition.first }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_condition_attributes) { attributes_for(:variables_condition) }
        let(:variables) { { params: { id: condition.id, cutOffStart: 15, cutOffEnd: 100 } } }

        it 'update the condition' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          condition.reload

          expect(condition.cut_off_start).to eq(variables[:params][:cutOffStart])
        end

        it 'returns the updated condition' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateCondition',
              'condition',
              'id'
            )
          ).to eq(condition.id.to_s)
        end
      end

      def query
        <<~GQL
          mutation($params: ConditionInput!) {
            updateCondition(
              input: {
                params: $params
              }
            ) {
              condition {
                id
                cutOffStart
                cutOffEnd
              }
            }
          }
        GQL
      end
    end
  end
end
