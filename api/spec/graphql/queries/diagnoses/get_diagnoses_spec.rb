require 'rails_helper'

module Queries
  module Diagnoses
    describe GetDiagnoses, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:algorithm) { Algorithm.first }
        let(:decision_tree) { algorithm.decision_trees.first }
        let(:diagnoses) { Diagnosis.where(decision_tree: algorithm.decision_trees) }

        it 'return paginated diagnoses' do
          result = ApiSchema.execute(
            query, variables: { algorithmId: algorithm.id }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnoses',
              'edges',
              -1,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(diagnoses.last.label_translations['en'])
        end

        it 'return every diagnoses for a decision tree' do
          result = ApiSchema.execute(
            query, variables: { algorithmId: algorithm.id, decisionTreeId: decision_tree.id }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnoses',
              'edges',
              -1,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_tree.diagnoses.last.label_translations['en'])
        end

        it 'returns diagnoses with the label matching search term' do
          result = ApiSchema.execute(
            query, variables: { algorithmId: algorithm.id, searchTerm: 'Col' }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnoses',
              'edges',
              -1,
              'node',
              'labelTranslations',
              'en'
            )
          ).to eq(Diagnosis.where(decision_tree: algorithm.decision_trees).search('Col',
                                                                                  algorithm.project.language.code).last.label_translations['en'])
        end

        it 'returns no diagnosis with a made up search term' do
          result = ApiSchema.execute(
            query, variables: { algorithmId: algorithm.id, searchTerm: "It's me, Malario" }, context: context
          )

          expect(
            result.dig(
              'data',
              'getDiagnoses',
              'edges'
            )
          ).to be_empty
        end
      end

      def query
        <<~GQL
          query($algorithmId: ID!, $decisionTreeId: ID, $searchTerm: String) {
            getDiagnoses(algorithmId: $algorithmId, decisionTreeId: $decisionTreeId, searchTerm: $searchTerm) {
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
