/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation ($id: ID!) {
          destroyAlgorithm(id: $id) {
            id
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.destroyAlgorithm.algorithm,
    invalidatesTags: ['Algorithm'],
  })
