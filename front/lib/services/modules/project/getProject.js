/**
 * The external imports
 */
import { gql } from 'graphql-request'

// TODO : Fix this with new datatable structure. Maybe separate the requests ?
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
            }
            node {
              id
              labelTranslations {
                en
                fr
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
