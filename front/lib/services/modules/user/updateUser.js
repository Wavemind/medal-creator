/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    mutation: id => ({
      document: gql`
      mutation {
        updateUser(id: ${id}) {
          id
          email
          firstName
          lastName
        }
      }
      `,
    }),
    transformResponse: response => response.updateUser,
    invalidatesTags: ['User'],
  })
