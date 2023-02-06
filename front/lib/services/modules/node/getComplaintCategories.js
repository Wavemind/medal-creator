/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import calculatePagination from '/lib/utils/calculatePagination'
import { HSTORE_LANGUAGES } from '/lib/config/constants'

export default build =>
  build.query({
    query: tableState => {
      const { endCursor, startCursor, search } = tableState
      return {
        document: gql`
          query (
            $after: String
            $before: String
            $first: Int
            $last: Int
            $searchTerm: String
          ) {
            getComplaintCategories(
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
                    ${HSTORE_LANGUAGES}
                  }
                }
              }
            }
          }
        `,
        variables: {
          after: endCursor,
          before: startCursor,
          searchTerm: search,
          ...calculatePagination(tableState),
        },
      }
    },
    transformResponse: response => response.nodes,
    providesTags: ['Node'],
  })
