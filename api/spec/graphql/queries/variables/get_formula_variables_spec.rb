require 'rails_helper'

module Queries
  module Variables
    describe GetFormulaVariables, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }

        it 'return paginated complaint categories' do
          result = RailsGraphqlSchema.execute(
            query, variables: { projectId: Project.first.id }, context: context
          )

          expect(
            result.dig(
              'data',
              'getFormulaVariables',
              'edges',
              0,
              'node',
              'answerType',
              'id'
            )
          ).to be_in(%w[3 4 6])
        end
      end

      def query
        <<~GQL
          query($projectId: ID!) {
            getFormulaVariables(projectId: $projectId) {
              edges {
                node {
                  answerType {
                    id
                  }
                }
              }
            }
          }
        GQL
      end
    end
  end
end
