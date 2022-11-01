/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: ({
      projectId,
      perPage,
      pageCount,
      pageIndex,
      lastPerPage,
      endCursor,
      startCursor,
      search,
    }) => {
      let numberText = ''
      // If both are empty
      if (endCursor === '' && startCursor === '') {
        // Querying first page
        if (pageCount === 1) {
          numberText = `first: ${perPage}`
        } else if (pageIndex === pageCount) {
          // Querying last page
          // If the last page has fewer than the normal perPage,
          // get only that many, otherwise get the full perPage
          numberText = `last: ${lastPerPage !== 0 ? lastPerPage : perPage}`
        } else {
          numberText = `first: ${perPage}`
        }
        // If endCursor is not empty => forward pagination
      } else if (endCursor !== '') {
        numberText = `first: ${perPage}`
        // If startCursor is not empty => backward pagination
      } else {
        numberText = `last: ${perPage}`
      }

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
