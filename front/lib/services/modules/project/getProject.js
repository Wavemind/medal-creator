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
          drugsCount
          variablesCount
          managementsCount
          medicalConditionsCount
          lastUpdatedDecisionTrees {
            id
            label
            node {
              id
              label
            }
            algorithm {
              id
              name
            }
            updatedAt
          }
        }
      }
      `,
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
