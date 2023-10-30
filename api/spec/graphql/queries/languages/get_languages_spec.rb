require 'rails_helper'

module Queries
  module Languages
    describe GetLanguages, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let!(:language) { create(:language) }

        it 'return languages' do
          result = ApiSchema.execute(
            query, context: context
          )

          expect(
            result.dig(
              'data',
              'getLanguages',
              -1,
              'name'
            )
          ).to eq(language[:name])
        end
      end

      def query
        <<~GQL
          query {
            getLanguages {
              name
              code
            }
          }
        GQL
      end
    end
  end
end
