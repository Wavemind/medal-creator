/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: name => ({
      document: gql`
      query {
        getProject(name: "${name}") {
          id
          name
          algorithmsCount
          variablesCount
          drugsCount
          managementsCount
          medicalConditionsCount
        }
      }
      `,
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
