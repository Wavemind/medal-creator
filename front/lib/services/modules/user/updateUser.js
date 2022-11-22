/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $id: ID!
          $firstName: String
          $lastName: String
          $email: String
        ) {
          updateUser(
            input: {
              params: {
                id: $id
                firstName: $firstName
                lastName: $lastName
                email: $email
              }
            }
          ) {
            user {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.updateUser,
    invalidatesTags: ['User'],
  })
