require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetLastUpdatedDecisionTrees, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree) { create(:decision_tree) }
        let(:variables) { { projectId: decision_tree.algorithm.project_id } }

        it 'return a paginated last updated decision trees' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getLastUpdatedDecisionTrees',
              'edges',
              0,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_tree.label_translations['en'])
        end
      end

      def query
        <<~GQL
          query ($projectId: ID!) {
            getLastUpdatedDecisionTrees(projectId: $projectId) {
              edges {
                node {
                  id
                  labelTranslations {
                    en
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
