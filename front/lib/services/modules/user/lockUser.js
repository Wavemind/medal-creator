/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: id => ({
      document: gql`
        mutation ($id: ID!) {
          lockUser(input: { id: $id }) {
            user {
              id
            }
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.lockUser,
    invalidatesTags: ['User'],
  })
