/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation {
          updateUser(input: {
            params: {
              id: ${values.id},
              firstName: "${values.firstName}",
              lastName: "${values.lastName}"
            }
          }) {
            user {
              firstName
              lastName
            }
          }
        }
      `,
      values,
    }),
    transformResponse: response => response.updateUser,
    invalidatesTags: ['User'],
  })
