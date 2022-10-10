/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
      query {
        getUser(id: ${id}) {
          id
          email
          firstName
          lastName
        }
      }
      `,
    }),
    transformResponse: response => response.getUser,
  })
