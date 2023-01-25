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
      const { projectId, endCursor, startCursor, search } = tableState
      return {
        document: gql`
          query (
            $projectId: ID!
            $after: String
            $before: String
            $first: Int
            $last: Int
            $searchTerm: String
          ) {
            getAlgorithms(
              projectId: $projectId
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
                  name
                  mode
                  status
                  updatedAt
                }
              }
            }
          }
        `,
        variables: {
          projectId,
          after: endCursor,
          before: startCursor,
          searchTerm: search,
          ...calculatePagination(tableState),
        },
      }
    },
    transformResponse: response => response.getAlgorithms,
    providesTags: ['Algorithm'],
  })
