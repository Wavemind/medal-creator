/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: id => ({
      document: gql`
        mutation ($id: ID!) {
          unsubscribeFromProject(input: { id: $id }) {
            project {
              id
            }
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.unsubscribeFromProject.project,
    invalidatesTags: ['Project'],
  })
