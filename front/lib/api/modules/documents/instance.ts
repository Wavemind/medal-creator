/**
 * The external imports
 */
import { gql } from 'graphql-request'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'

export const getInstancesDocument = gql`
  query ($nodeId: ID!, $algorithmId: ID) {
    getInstances(nodeId: $nodeId, algorithmId: $algorithmId) {
      id
      diagramName
      instanceableType
      instanceableId
      diagnosisId
    }
  }
`

export const createInstanceDocument = gql`
  mutation (
    $nodeId: ID!
    $instanceableId: ID!
    $instanceableType: String!
    $positionX: Float
    $positionY: Float
  ) {
    createInstance(
      input: {
        params: {
          nodeId: $nodeId
          instanceableId: $instanceableId
          instanceableType: $instanceableType
          positionX: $positionX
          positionY: $positionY
        }
      }
    ) {
      instance {
        id
      }
    }
  }
`

export const getComponentsDocument = gql`
  query ($instanceableId: ID!, $instanceableType: String!) {
    getComponents(
      instanceableId: $instanceableId
      instanceableType: $instanceableType
    ) {
      id
      positionX
      positionY
      conditions {
        answer {
          id
        }
        instance {
          id
        }
        cutOffStart
        cutOffEnd
        score
      }
      node {
        labelTranslations {
          ${HSTORE_LANGUAGES}
        }
        category
        diagramAnswers {
          id
          labelTranslations {
            ${HSTORE_LANGUAGES}
          }
        }
      }
    }
  }
`
