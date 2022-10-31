/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { DEFAULT_TABLE_PER_PAGE } from '/lib/config/constants'

export default build =>
  build.query({
    query: ({
      projectId,
      perPage,
      pageCount,
      pageIndex,
      lastPerPage,
      endCursor = '',
      startCursor = '',
    }) => {
      const isLastPage = pageIndex === pageCount
      const isLast = `${isLastPage ? 'last' : 'first'}: ${
        isLastPage ? lastPerPage : perPage
      }`

      return {
        document: gql`
        query {
          getAlgorithms(
            projectId: ${projectId}, 
            ${isLast},
            after: "${endCursor}",
            before: "${startCursor}"
          ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
            }
            totalCount
            edges {
              node {
                id
                name
                updatedAt
              }
              cursor
            }
          }
        }
      `,
      }
    },
    transformResponse: response => response.getAlgorithms,
    providesTags: ['Algorithm'],
  })
