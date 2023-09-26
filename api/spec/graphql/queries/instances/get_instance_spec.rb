require 'rails_helper'

module Queries
  module Instances
    describe GetInstance, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:instance) { create(:instance) }
        let(:variables) { { id: instance.id } }

        it 'returns a instance' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getInstance',
              'diagramName'
            )
          ).to eq(instance.instanceable.reference_label)
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Instance does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getInstance(id: $id) {
              id
              diagramName
            }
          }
        GQL
      end
    end
  end
end
