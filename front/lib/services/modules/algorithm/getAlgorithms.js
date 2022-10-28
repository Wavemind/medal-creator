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
      perPage = DEFAULT_TABLE_PER_PAGE,
      nextToken = '',
    }) => ({
      document: gql`
        query {
          getAlgorithms(projectId: ${projectId}, first: ${perPage}, after: "${nextToken}") {
            pageInfo {
              hasNextPage
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
    }),
    transformResponse: response => response.getAlgorithms,
    providesTags: ['Algorithm'],
  })
