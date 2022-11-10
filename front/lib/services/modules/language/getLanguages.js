/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: () => ({
      document: gql`
        query {
          getLanguages {
            id
            code
            name
          }
        }
      `,
    }),
    transformResponse: response => response.getLanguages,
  })
