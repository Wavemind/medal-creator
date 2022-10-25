/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: id => ({
      document: gql`
      query {
        getProject(id: ${id}) {
          id
          name
          algorithmsCount
          drugsCount
          questionsCount
          managementsCount
          questionsSequencesCount
          lastUpdatedDecisionTrees {
            id
            labelTranslations {
              en
              fr
              id
            }
            node {
              id
              labelTranslations {
                en
                fr
                id
              }
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
