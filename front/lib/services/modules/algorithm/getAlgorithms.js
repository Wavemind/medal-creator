/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: projectId => ({
      document: gql`
      query {
        getAlgorithms(projectId: "${projectId}") {
          id
          name
          status
          mode
          updatedAt
        }
      }
      `,
    }),
    transformResponse: response => response.getAlgorithms,
    providesTags: ['Algorithm'],
  })
