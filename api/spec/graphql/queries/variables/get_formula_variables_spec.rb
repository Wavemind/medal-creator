require 'rails_helper'

module Queries
  module Variables
    describe GetFormulaVariables, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }

        # TODO: Add date answertype test
        it 'return paginated complaint categories' do
          result = ApiSchema.execute(
            query, variables: { projectId: Project.first.id, answerType: 'numeric' }, context: context
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
          query($projectId: ID!, $answerType: FormulaAnswerTypeEnum!, $searchTerm: String) {
            getFormulaVariables(projectId: $projectId, answerType: $answerType, searchTerm: $searchTerm) {
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
