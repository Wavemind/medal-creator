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
          $role: Int
          $userProjectsAttributes: [UserProjectInput!]
        ) {
          updateUser(
            input: {
              params: {
                id: $id
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
              firstName
              lastName
              email
              role
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.updateUser,
    invalidatesTags: ['User'],
  })
