/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation (
          $id: ID!
          $labelTranslations: HstoreInput!
          $descriptionTranslations: HstoreInput!
          $levelOfUrgency: Int
        ) {
          updateDiagnosis(
            input: {
              params: {
                id: $id
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
    transformResponse: response => response.updateDiagnosis.diagnosis,
    invalidatesTags: ['Diagnosis'],
  })
