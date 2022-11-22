/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation ($firstName: String!, $lastName: String!, $email: String!) {
          createUser(
            input: {
              params: {
                firstName: $firstName
                lastName: $lastName
                email: $email
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
    transformResponse: response => response.createUser.user,
    invalidatesTags: ['User'],
  })
