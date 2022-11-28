/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $firstName: String!
          $lastName: String!
          $email: String!
          $role: Int!
          $userProjectsAttributes: [UserProjectInput!]
        ) {
          createUser(
            input: {
              params: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                role: $role
                userProjectsAttributes: $userProjectsAttributes
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
