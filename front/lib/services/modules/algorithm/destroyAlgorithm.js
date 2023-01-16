/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: id => ({
      document: gql`
        mutation ($id: ID!) {
          destroyAlgorithm(input: { id: $id }) {
            id
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.destroyAlgorithm.algorithm,
    invalidatesTags: ['Algorithm'],
  })
