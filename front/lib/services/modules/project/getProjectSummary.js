/**
 * The external imports
 */
import { gql } from 'graphql-request'

// TODO : Fix this with new datatable structure. Maybe separate the requests ?
export default build =>
  build.query({
    query: id => ({
      document: gql`
        query ($id: ID!) {
          getProjectSummary(id: $id) {
            id
            algorithmsCount
            drugsCount
            questionsCount
            managementsCount
            questionsSequencesCount
          }
        }
      `,
      variables: { id },
    }),
    transformResponse: response => response.getProjectSummary,
    providesTags: ['Project'],
  })
