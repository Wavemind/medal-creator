import * as Types from '../../../../types/graphql.d'

import {
  HstoreLanguagesFragmentDoc,
  MediaFieldsFragmentDoc,
} from './fragments.generated'
import { apiGraphql } from '@/lib/api/apiGraphql'
export type DiagnosisFieldsFragment = {
  __typename?: 'Diagnosis'
  id: string
  levelOfUrgency: number
  labelTranslations: {
    __typename?: 'Hstore'
    en?: string | null
    fr?: string | null
  }
  descriptionTranslations?: {
    __typename?: 'Hstore'
    en?: string | null
    fr?: string | null
  } | null
}

export type GetDiagnosisQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type GetDiagnosisQuery = {
  getDiagnosis: {
    __typename?: 'Diagnosis'
    id: string
    levelOfUrgency: number
    files: Array<{
      __typename?: 'File'
      id: string
      name: string
      size: number
      url: string
      extension: string
    }>
    labelTranslations: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    }
    descriptionTranslations?: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    } | null
  }
}

export type GetDiagnosesQueryVariables = Types.Exact<{
  algorithmId: Types.Scalars['ID']
  decisionTreeId?: Types.InputMaybe<Types.Scalars['ID']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  before?: Types.InputMaybe<Types.Scalars['String']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  last?: Types.InputMaybe<Types.Scalars['Int']>
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetDiagnosesQuery = {
  getDiagnoses: {
    __typename?: 'DiagnosisConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor?: string | null
      startCursor?: string | null
    }
    edges: Array<{
      __typename?: 'DiagnosisEdge'
      node: {
        __typename?: 'Diagnosis'
        hasInstances?: boolean | null
        id: string
        levelOfUrgency: number
        labelTranslations: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        }
        descriptionTranslations?: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        } | null
      }
    }>
  }
}

export type CreateDiagnosisMutationVariables = Types.Exact<{
  decisionTreeId: Types.Scalars['ID']
  labelTranslations: Types.HstoreInput
  descriptionTranslations: Types.HstoreInput
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>
  filesToAdd?: Types.InputMaybe<
    Array<Types.Scalars['Upload']> | Types.Scalars['Upload']
  >
}>

export type CreateDiagnosisMutation = {
  createDiagnosis: {
    __typename?: 'CreateDiagnosisPayload'
    diagnosis?: { __typename?: 'Diagnosis'; id: string } | null
  }
}

export type UpdateDiagnosisMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
  decisionTreeId?: Types.InputMaybe<Types.Scalars['ID']>
  labelTranslations: Types.HstoreInput
  descriptionTranslations: Types.HstoreInput
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>
  filesToAdd?: Types.InputMaybe<
    Array<Types.Scalars['Upload']> | Types.Scalars['Upload']
  >
  existingFilesToRemove?: Types.InputMaybe<
    Array<Types.Scalars['Int']> | Types.Scalars['Int']
  >
}>

export type UpdateDiagnosisMutation = {
  updateDiagnosis?: {
    __typename?: 'UpdateDiagnosisPayload'
    diagnosis?: { __typename?: 'Diagnosis'; id: string } | null
  } | null
}

export type DestroyDiagnosisMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type DestroyDiagnosisMutation = {
  destroyDiagnosis?: {
    __typename?: 'DestroyDiagnosisPayload'
    id?: string | null
  } | null
}

export const DiagnosisFieldsFragmentDoc = `
    fragment DiagnosisFields on Diagnosis {
  id
  labelTranslations {
    ...HstoreLanguages
  }
  descriptionTranslations {
    ...HstoreLanguages
  }
  levelOfUrgency
}
    ${HstoreLanguagesFragmentDoc}`
export const GetDiagnosisDocument = `
    query getDiagnosis($id: ID!) {
  getDiagnosis(id: $id) {
    ...DiagnosisFields
    files {
      ...MediaFields
    }
  }
}
    ${DiagnosisFieldsFragmentDoc}
${MediaFieldsFragmentDoc}`
export const GetDiagnosesDocument = `
    query getDiagnoses($algorithmId: ID!, $decisionTreeId: ID, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getDiagnoses(
    algorithmId: $algorithmId
    decisionTreeId: $decisionTreeId
    after: $after
    before: $before
    first: $first
    last: $last
    searchTerm: $searchTerm
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    totalCount
    edges {
      node {
        ...DiagnosisFields
        hasInstances
      }
    }
  }
}
    ${DiagnosisFieldsFragmentDoc}`
export const CreateDiagnosisDocument = `
    mutation createDiagnosis($decisionTreeId: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $filesToAdd: [Upload!]) {
  createDiagnosis(
    input: {params: {decisionTreeId: $decisionTreeId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency}, files: $filesToAdd}
  ) {
    diagnosis {
      id
    }
  }
}
    `
export const UpdateDiagnosisDocument = `
    mutation updateDiagnosis($id: ID!, $decisionTreeId: ID, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $filesToAdd: [Upload!], $existingFilesToRemove: [Int!]) {
  updateDiagnosis(
    input: {params: {id: $id, decisionTreeId: $decisionTreeId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency}, filesToAdd: $filesToAdd, existingFilesToRemove: $existingFilesToRemove}
  ) {
    diagnosis {
      id
    }
  }
}
    `
export const DestroyDiagnosisDocument = `
    mutation destroyDiagnosis($id: ID!) {
  destroyDiagnosis(input: {id: $id}) {
    id
  }
}
    `

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDiagnosis: build.query<GetDiagnosisQuery, GetDiagnosisQueryVariables>({
      query: variables => ({ document: GetDiagnosisDocument, variables }),
    }),
    getDiagnoses: build.query<GetDiagnosesQuery, GetDiagnosesQueryVariables>({
      query: variables => ({ document: GetDiagnosesDocument, variables }),
    }),
    createDiagnosis: build.mutation<
      CreateDiagnosisMutation,
      CreateDiagnosisMutationVariables
    >({
      query: variables => ({ document: CreateDiagnosisDocument, variables }),
    }),
    updateDiagnosis: build.mutation<
      UpdateDiagnosisMutation,
      UpdateDiagnosisMutationVariables
    >({
      query: variables => ({ document: UpdateDiagnosisDocument, variables }),
    }),
    destroyDiagnosis: build.mutation<
      DestroyDiagnosisMutation,
      DestroyDiagnosisMutationVariables
    >({
      query: variables => ({ document: DestroyDiagnosisDocument, variables }),
    }),
  }),
})

export { injectedRtkApi as api }
