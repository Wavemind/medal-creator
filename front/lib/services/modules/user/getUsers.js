/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: projectId => ({
      document: gql`
        query ($projectId: ID) {
          getUsers {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: projectId,
    }),
    transformResponse: response => response.getUsers,
    providesTags: ['User'],
  })
