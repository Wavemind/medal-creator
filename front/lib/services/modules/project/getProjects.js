/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: () => ({
      document: gql`
        query {
          getProjects {
            id
            name
            isCurrentUserAdmin
          }
        }
      `,
    }),
    transformResponse: response => response.getProjects,
    providesTags: ['Project'],
  })
