/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: projectId => ({
      document: gql`
        query ($projectId: ID) {
          getUsers(projectId: $projectId) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        projectId: projectId,
      },
    }),
    transformResponse: response => response.getUsers,
    providesTags: ['User'],
  })
