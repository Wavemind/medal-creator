/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $id: ID!
          $labelTranslations: HstoreInput!
          $nodeId: ID!
          $cutOffStart: Int
          $cutOffEnd: Int
          $cutOffValueType: String
        ) {
          updateDecisionTree(
            input: {
              params: {
                id: $id
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
    transformResponse: response => response.updateDecisionTree.decisionTree,
    invalidatesTags: ['DecisionTree'],
  })
