/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: ({ search }) => ({
      document: gql`
        query ($searchTerm: String) {
          getProjects(searchTerm: $searchTerm) {
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
                isCurrentUserAdmin
              }
            }
          }
        }
      `,
      variables: { searchTerm: search },
    }),
    transformResponse: response => response.getProjects,
    providesTags: ['Project'],
  })
