/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $decisionTreeId: ID!
          $labelTranslations: HstoreInput!
          $descriptionTranslations: HstoreInput!
          $levelOfUrgency: Int
        ) {
          createDiagnosis(
            input: {
              params: {
                decisionTreeId: $decisionTreeId
                labelTranslations: $labelTranslations
                descriptionTranslations: $descriptionTranslations
                levelOfUrgency: $levelOfUrgency
              }
            }
          ) {
            diagnosis {
              id
            }
          }
        }
      `,
      variables: values,
    }),
    transformResponse: response => response.createDiagnosis.diagnosis,
    invalidatesTags: ['Diagnosis'],
  })
