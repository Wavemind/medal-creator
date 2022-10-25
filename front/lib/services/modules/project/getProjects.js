/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: () => ({
      document: gql`
        query {
          getProjects {
            id
            name
            algorithmsCount
            drugsCount
            questionsCount
            managementsCount
            questionsSequencesCount
          }
        }
      `,
    }),
    transformResponse: response => response.getProject,
    providesTags: ['Project'],
  })
