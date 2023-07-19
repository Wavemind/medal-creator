require 'rails_helper'

module Queries
  module Conditions
    describe GetCondition, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }

        it 'returns an condition' do
          condition = Condition.first

          result = ApiSchema.execute(
            query, variables: { id: condition.id }, context: context
          )

          expect(
            result.dig(
              'data',
              'getCondition',
              'id'
            )
          ).to eq(condition.id.to_s)
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Condition does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getCondition(id: $id) {
              id
            }
          }
        GQL
      end
    end
  end
end
