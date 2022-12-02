/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation ($id: ID!) {
          destroyAlgorithm(input: { params: { id: $id } }) {
            id
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.destroyAlgorithm.algorithm,
    invalidatesTags: ['Algorithm'],
  })
