/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePagination from '/lib/utils/calculatePagination'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

// TODO : Fix this when @Manu has finalized the backend
export default build =>
  build.query({
    query: tableState => {
      const { projectId, endCursor, startCursor } = tableState
      return {
        document: gql`
          query (
            $projectId: ID!
            $after: String
            $before: String
            $first: Int
            $last: Int
          ) {
            getLastUpdatedDecisionTrees(
              projectId: $projectId
              after: $after
              before: $before
              first: $first
              last: $last
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
                  updatedAt
                  labelTranslations {
                    ${HSTORE_LANGUAGES}
                  }
                  algorithm {
                    name
                  }
                  node {
                    labelTranslations {
                      ${HSTORE_LANGUAGES}
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          projectId,
          after: endCursor,
          before: startCursor,
          ...calculatePagination(tableState),
        },
      }
    },
    transformResponse: response => response.getLastUpdatedDecisionTrees,
    providesTags: ['Project'],
  })
