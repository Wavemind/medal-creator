/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
        query ($id: ID!) {
          getProject(id: $id) {
            id
            name
            language {
              code
            }
            isCurrentUserAdmin
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
