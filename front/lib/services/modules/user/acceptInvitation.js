/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $password: String!
          $passwordConfirmation: String!
          $invitationToken: String!
        ) {
          acceptInvitation(
            input: {
              params: {
                password: $password
                passwordConfirmation: $passwordConfirmation
                invitationToken: $invitationToken
              }
            }
          ) {
            user {
              id
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.acceptInvitation,
    invalidatesTags: ['User'],
  })
