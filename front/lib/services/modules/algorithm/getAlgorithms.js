/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePaginationNumberText from '/lib/utils/calculatePaginationNumberText'

export default build =>
  build.query({
    query: tableState => {
      const { projectId, endCursor, startCursor, search } = tableState

      const numberText = calculatePaginationNumberText(tableState)

      // TODO : Get type and status data as well. Check with Manu for the enum
      return {
        document: gql`
        query {
          getAlgorithms(
            projectId: ${projectId}, 
            ${numberText},
            after: "${endCursor}",
            before: "${startCursor}",
            searchTerm: "${search}"
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
                updatedAt
              }
            }
          }
        }
      `,
      }
    },
    transformResponse: response => response.getAlgorithms,
    providesTags: ['Algorithm'],
  })
