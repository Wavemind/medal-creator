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
          $password: String!
          $passwordConfirmation: String!
        ) {
          updateUser(
            input: {
              params: {
                id: $id
                password: $password
                passwordConfirmation: $passwordConfirmation
              }
            }
          ) {
            user {
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
