/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: () => ({
      document: gql`
        query {
          getUsers {
            id
            firstName
            lastName
            email
          }
        }
      `,
    }),
    transformResponse: response => response.getUsers,
    providesTags: ['User'],
  })
