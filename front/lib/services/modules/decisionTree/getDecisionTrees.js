/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePagination from '/lib/utils/calculatePagination'

export default build =>
  build.query({
    query: tableState => {
      const { algorithmId, endCursor, startCursor, search } = tableState
      return {
        document: gql`
          query (
            $algorithmId: ID!
            $after: String
            $before: String
            $first: Int
            $last: Int
            $searchTerm: String
          ) {
            getDecisionTrees(
              algorithmId: $algorithmId
              after: $after
              before: $before
              first: $first
              last: $last
              searchTerm: $searchTerm
            ) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
              }
              totalCount
              edges {
                node {
                  id
                  labelTranslations {
                    en
                  }
                  node {
                    labelTranslations {
                      en
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          algorithmId,
          after: endCursor,
          before: startCursor,
          searchTerm: search,
          ...calculatePagination(tableState),
        },
      }
    },
    transformResponse: response => response.getDecisionTrees,
    providesTags: ['DecisionTree'],
  })
