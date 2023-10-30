require 'rails_helper'

module Queries
  module AnswerTypes
    describe GetAnswerTypes, type: :graphql do
      describe '.resolve' do
        let!(:context) { { current_api_v2_user: User.first } }

        it 'return answer types' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getAnswerTypes',
              0,
              'value'
            )
          ).to eq('Boolean')
        end
      end

      def query
        <<~GQL
          query {
            getAnswerTypes {
              display
              value
            }
          }
        GQL
      end
    end
  end
end
