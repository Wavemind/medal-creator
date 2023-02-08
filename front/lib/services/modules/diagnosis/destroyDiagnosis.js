/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: id => ({
      document: gql`
        mutation ($id: ID!) {
          destroyDiagnosis(input: { id: $id }) {
            id
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.destroyDiagnosis.diagnosis,
    invalidatesTags: ['Diagnosis'],
  })
