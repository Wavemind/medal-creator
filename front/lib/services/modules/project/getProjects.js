/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.query({
    query: () => ({
      document: gql`
       query {
         getProjects() {
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
               sw
             }
             node {
               id
               labelTranslations {
                 en
                 fr
                 id
                 sw
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
