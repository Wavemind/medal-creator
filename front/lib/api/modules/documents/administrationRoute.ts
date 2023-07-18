/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getAdministrationRoutesDocument = gql`
  query {
    getAdministrationRoutes {
      id
      category
      nameTranslations {
        ${HSTORE_LANGUAGES}
      }
    }
  }
`
