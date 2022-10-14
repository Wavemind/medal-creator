/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: projectName => ({
      document: gql`
      query {
        getAlgorithms(projectName: "${projectName}") {
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
