/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
        query ($id: ID!) {
          getUser(id: $id) {
            id
            email
            firstName
            lastName
            role
            userProjects {
              id
              projectId
              isAdmin
              project {
                name
              }
            }
          }
        }
      `,
      variables: {
        id,
      },
    }),
    transformResponse: response => response.getUser,
    providesTags: ['User'],
  })
