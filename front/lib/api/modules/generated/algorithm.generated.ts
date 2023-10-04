import * as Types from '../../../../types/graphql.d'

import {
  HstoreLanguagesFragmentDoc,
  MediaFieldsFragmentDoc,
} from './fragments.generated'
import { apiGraphql } from '@/lib/api/apiGraphql'
export type AlgorithmFieldsFragment = {
  __typename?: 'Algorithm'
  id: string
  name: string
  minimumAge: number
  mode?: string | null
  ageLimit: number
  descriptionTranslations: {
    __typename?: 'Hstore'
    en?: string | null
    fr?: string | null
  }
  ageLimitMessageTranslations: {
    __typename?: 'Hstore'
    en?: string | null
    fr?: string | null
  }
  languages: Array<{
    __typename?: 'Language'
    id: string
    name: string
    code: string
  }>
}

export type GetAlgorithmQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type GetAlgorithmQuery = {
  getAlgorithm: {
    __typename?: 'Algorithm'
    id: string
    name: string
    minimumAge: number
    mode?: string | null
    ageLimit: number
    descriptionTranslations: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    }
    ageLimitMessageTranslations: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    }
    languages: Array<{
      __typename?: 'Language'
      id: string
      name: string
      code: string
    }>
  }
}

export type GetAlgorithmOrderingQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type GetAlgorithmOrderingQuery = {
  getAlgorithm: {
    __typename?: 'Algorithm'
    formattedConsultationOrder?: any | null
    usedVariables: Array<number>
    id: string
    name: string
    minimumAge: number
    mode?: string | null
    ageLimit: number
    descriptionTranslations: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    }
    ageLimitMessageTranslations: {
      __typename?: 'Hstore'
      en?: string | null
      fr?: string | null
    }
    languages: Array<{
      __typename?: 'Language'
      id: string
      name: string
      code: string
    }>
  }
}

export type GetAlgorithmsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID']
  after?: Types.InputMaybe<Types.Scalars['String']>
  before?: Types.InputMaybe<Types.Scalars['String']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  last?: Types.InputMaybe<Types.Scalars['Int']>
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetAlgorithmsQuery = {
  getAlgorithms: {
    __typename?: 'AlgorithmConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor?: string | null
      startCursor?: string | null
    }
    edges: Array<{
      __typename?: 'AlgorithmEdge'
      node: {
        __typename?: 'Algorithm'
        status: string
        updatedAt?: any | null
        id: string
        name: string
        minimumAge: number
        mode?: string | null
        ageLimit: number
        descriptionTranslations: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        }
        ageLimitMessageTranslations: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        }
        languages: Array<{
          __typename?: 'Language'
          id: string
          name: string
          code: string
        }>
      }
    }>
  }
}

export type ExportDataQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
  exportType: Types.Scalars['String']
}>

export type ExportDataQuery = {
  exportData?: {
    __typename?: 'ResponseData'
    success: boolean
    url?: string | null
  } | null
}

export type CreateAlgorithmMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID']
  name: Types.Scalars['String']
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>
  mode?: Types.InputMaybe<Types.Scalars['String']>
  ageLimit?: Types.InputMaybe<Types.Scalars['Int']>
  ageLimitMessageTranslations?: Types.InputMaybe<Types.HstoreInput>
  minimumAge?: Types.InputMaybe<Types.Scalars['Int']>
  languageIds?: Types.InputMaybe<
    Array<Types.Scalars['ID']> | Types.Scalars['ID']
  >
}>

export type CreateAlgorithmMutation = {
  createAlgorithm?: {
    __typename?: 'CreateAlgorithmPayload'
    algorithm?: { __typename?: 'Algorithm'; id: string } | null
  } | null
}

export type UpdateAlgorithmMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
  name: Types.Scalars['String']
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>
  mode?: Types.InputMaybe<Types.Scalars['String']>
  ageLimit?: Types.InputMaybe<Types.Scalars['Int']>
  ageLimitMessageTranslations?: Types.InputMaybe<Types.HstoreInput>
  minimumAge?: Types.InputMaybe<Types.Scalars['Int']>
  languageIds?: Types.InputMaybe<
    Array<Types.Scalars['ID']> | Types.Scalars['ID']
  >
  fullOrderJson?: Types.InputMaybe<Types.Scalars['JSON']>
}>

export type UpdateAlgorithmMutation = {
  updateAlgorithm?: {
    __typename?: 'UpdateAlgorithmPayload'
    algorithm?: { __typename?: 'Algorithm'; id: string } | null
  } | null
}

export type DestroyAlgorithmMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type DestroyAlgorithmMutation = {
  destroyAlgorithm?: {
    __typename?: 'DestroyAlgorithmPayload'
    id?: string | null
  } | null
}

export const AlgorithmFieldsFragmentDoc = `
    fragment AlgorithmFields on Algorithm {
  id
  name
  minimumAge
  descriptionTranslations {
    ...HstoreLanguages
  }
  mode
  ageLimit
  ageLimitMessageTranslations {
    ...HstoreLanguages
  }
  languages {
    id
    name
    code
  }
}
    ${HstoreLanguagesFragmentDoc}`
export const GetAlgorithmDocument = `
    query getAlgorithm($id: ID!) {
  getAlgorithm(id: $id) {
    ...AlgorithmFields
  }
}
    ${AlgorithmFieldsFragmentDoc}`
export const GetAlgorithmOrderingDocument = `
    query getAlgorithmOrdering($id: ID!) {
  getAlgorithm(id: $id) {
    ...AlgorithmFields
    formattedConsultationOrder
    usedVariables
  }
}
    ${AlgorithmFieldsFragmentDoc}`
export const GetAlgorithmsDocument = `
    query getAlgorithms($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getAlgorithms(
    projectId: $projectId
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
        ...AlgorithmFields
        status
        updatedAt
      }
    }
  }
}
    ${AlgorithmFieldsFragmentDoc}`
export const ExportDataDocument = `
    query exportData($id: ID!, $exportType: String!) {
  exportData(id: $id, exportType: $exportType) {
    success
    url
  }
}
    `
export const CreateAlgorithmDocument = `
    mutation createAlgorithm($projectId: ID!, $name: String!, $descriptionTranslations: HstoreInput, $mode: String, $ageLimit: Int, $ageLimitMessageTranslations: HstoreInput, $minimumAge: Int, $languageIds: [ID!]) {
  createAlgorithm(
    input: {params: {projectId: $projectId, name: $name, descriptionTranslations: $descriptionTranslations, mode: $mode, ageLimit: $ageLimit, ageLimitMessageTranslations: $ageLimitMessageTranslations, minimumAge: $minimumAge, languageIds: $languageIds}}
  ) {
    algorithm {
      id
    }
  }
}
    `
export const UpdateAlgorithmDocument = `
    mutation updateAlgorithm($id: ID!, $name: String!, $descriptionTranslations: HstoreInput, $mode: String, $ageLimit: Int, $ageLimitMessageTranslations: HstoreInput, $minimumAge: Int, $languageIds: [ID!], $fullOrderJson: JSON) {
  updateAlgorithm(
    input: {params: {id: $id, name: $name, descriptionTranslations: $descriptionTranslations, mode: $mode, ageLimit: $ageLimit, ageLimitMessageTranslations: $ageLimitMessageTranslations, minimumAge: $minimumAge, languageIds: $languageIds, fullOrderJson: $fullOrderJson}}
  ) {
    algorithm {
      id
    }
  }
}
    `
export const DestroyAlgorithmDocument = `
    mutation destroyAlgorithm($id: ID!) {
  destroyAlgorithm(input: {id: $id}) {
    id
  }
}
    `

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getAlgorithm: build.query<GetAlgorithmQuery, GetAlgorithmQueryVariables>({
      query: variables => ({ document: GetAlgorithmDocument, variables }),
    }),
    getAlgorithmOrdering: build.query<
      GetAlgorithmOrderingQuery,
      GetAlgorithmOrderingQueryVariables
    >({
      query: variables => ({
        document: GetAlgorithmOrderingDocument,
        variables,
      }),
    }),
    getAlgorithms: build.query<GetAlgorithmsQuery, GetAlgorithmsQueryVariables>(
      {
        query: variables => ({ document: GetAlgorithmsDocument, variables }),
      }
    ),
    exportData: build.query<ExportDataQuery, ExportDataQueryVariables>({
      query: variables => ({ document: ExportDataDocument, variables }),
    }),
    createAlgorithm: build.mutation<
      CreateAlgorithmMutation,
      CreateAlgorithmMutationVariables
    >({
      query: variables => ({ document: CreateAlgorithmDocument, variables }),
    }),
    updateAlgorithm: build.mutation<
      UpdateAlgorithmMutation,
      UpdateAlgorithmMutationVariables
    >({
      query: variables => ({ document: UpdateAlgorithmDocument, variables }),
    }),
    destroyAlgorithm: build.mutation<
      DestroyAlgorithmMutation,
      DestroyAlgorithmMutationVariables
    >({
      query: variables => ({ document: DestroyAlgorithmDocument, variables }),
    }),
  }),
})

export { injectedRtkApi as api }
