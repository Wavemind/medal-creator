/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $algorithmId: ID!
          $labelTranslations: HstoreInput!
          $nodeId: ID!
          $cutOffStart: Int
          $cutOffEnd: Int
          $cutOffValueType: String
        ) {
          createDecisionTree(
            input: {
              params: {
                algorithmId: $algorithmId
                labelTranslations: $labelTranslations
                nodeId: $nodeId
                cutOffStart: $cutOffStart
                cutOffEnd: $cutOffEnd
                cutOffValueType: $cutOffValueType
              }
            }
          ) {
            decisionTree {
              id
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.createDecisionTree.decisionTree,
    invalidatesTags: ['DecisionTree'],
  })
