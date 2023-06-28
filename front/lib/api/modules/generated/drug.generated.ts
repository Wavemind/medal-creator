import * as Types from '../../../../types/graphql.d'

import { apiGraphql } from '@/lib/api/apiGraphql'
export type GetDrugsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID']
  after?: Types.InputMaybe<Types.Scalars['String']>
  before?: Types.InputMaybe<Types.Scalars['String']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  last?: Types.InputMaybe<Types.Scalars['Int']>
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetDrugsQuery = {
  getDrugs: {
    __typename?: 'DrugConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor?: string | null
      startCursor?: string | null
    }
    edges: Array<{
      __typename?: 'DrugEdge'
      node: {
        __typename?: 'Drug'
        id: string
        isNeonat: boolean
        isAntibiotic: boolean
        isAntiMalarial: boolean
        isDefault: boolean
        hasInstances?: boolean | null
        labelTranslations: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        }
      }
    }>
  }
}

export type EditDrugQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type EditDrugQuery = {
  getDrug?: {
    __typename?: 'Drug'
    id: string
    isNeonat: boolean
    isAntibiotic: boolean
    isAntiMalarial: boolean
    levelOfUrgency?: number | null
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
    formulations: Array<{
      __typename?: 'Formulation'
      id: string
      byAge?: boolean | null
      breakable?: Types.BreakableEnum | null
      uniqueDose?: number | null
      liquidConcentration?: number | null
      medicationForm: Types.MedicationFormEnum
      doseForm?: number | null
      maximalDose?: number | null
      minimalDosePerKg?: number | null
      maximalDosePerKg?: number | null
      dosesPerDay?: number | null
      administrationRoute?: {
        __typename?: 'AdministrationRoute'
        id: string
        category: string
        nameTranslations: {
          __typename?: 'Hstore'
          en?: string | null
          fr?: string | null
        }
      } | null
      injectionInstructionsTranslations?: {
        __typename?: 'Hstore'
        en?: string | null
        fr?: string | null
      } | null
      dispensingDescriptionTranslations?: {
        __typename?: 'Hstore'
        en?: string | null
        fr?: string | null
      } | null
      descriptionTranslations?: {
        __typename?: 'Hstore'
        en?: string | null
        fr?: string | null
      } | null
    }>
  } | null
}

export type DestroyDrugMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type DestroyDrugMutation = {
  destroyDrug?: { __typename?: 'DestroyDrugPayload'; id?: string | null } | null
}

export type CreateDrugMutationVariables = Types.Exact<{
  labelTranslations: Types.HstoreInput
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>
  isNeonat: Types.Scalars['Boolean']
  isAntibiotic: Types.Scalars['Boolean']
  isAntiMalarial: Types.Scalars['Boolean']
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>
  formulationsAttributes: Array<Types.FormulationInput> | Types.FormulationInput
  projectId?: Types.InputMaybe<Types.Scalars['ID']>
}>

export type CreateDrugMutation = {
  createDrug?: {
    __typename?: 'CreateDrugPayload'
    drug?: { __typename?: 'Drug'; id: string } | null
  } | null
}

export type UpdateDrugMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']
  labelTranslations: Types.HstoreInput
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>
  isNeonat: Types.Scalars['Boolean']
  isAntibiotic: Types.Scalars['Boolean']
  isAntiMalarial: Types.Scalars['Boolean']
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>
  formulationsAttributes: Array<Types.FormulationInput> | Types.FormulationInput
  projectId?: Types.InputMaybe<Types.Scalars['ID']>
}>

export type UpdateDrugMutation = {
  updateDrug?: {
    __typename?: 'UpdateDrugPayload'
    drug?: { __typename?: 'Drug'; id: string } | null
  } | null
}

export const GetDrugsDocument = `
    query getDrugs($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getDrugs(
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
        id
        isNeonat
        isAntibiotic
        isAntiMalarial
        isDefault
        hasInstances
        labelTranslations {
          en
          fr
        }
      }
    }
  }
}
    `
export const EditDrugDocument = `
    query editDrug($id: ID!) {
  getDrug(id: $id) {
    id
    labelTranslations {
      en
      fr
    }
    descriptionTranslations {
      en
      fr
    }
    isNeonat
    isAntibiotic
    isAntiMalarial
    levelOfUrgency
    formulations {
      id
      byAge
      breakable
      uniqueDose
      liquidConcentration
      medicationForm
      doseForm
      maximalDose
      minimalDosePerKg
      maximalDosePerKg
      dosesPerDay
      administrationRoute {
        id
        category
        nameTranslations {
          en
          fr
        }
      }
      injectionInstructionsTranslations {
        en
        fr
      }
      dispensingDescriptionTranslations {
        en
        fr
      }
      descriptionTranslations {
        en
        fr
      }
    }
  }
}
    `
export const DestroyDrugDocument = `
    mutation destroyDrug($id: ID!) {
  destroyDrug(input: {id: $id}) {
    id
  }
}
    `
export const CreateDrugDocument = `
    mutation createDrug($labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $isNeonat: Boolean!, $isAntibiotic: Boolean!, $isAntiMalarial: Boolean!, $levelOfUrgency: Int, $formulationsAttributes: [FormulationInput!]!, $projectId: ID) {
  createDrug(
    input: {params: {labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, isNeonat: $isNeonat, isAntibiotic: $isAntibiotic, isAntiMalarial: $isAntiMalarial, levelOfUrgency: $levelOfUrgency, formulationsAttributes: $formulationsAttributes, projectId: $projectId}}
  ) {
    drug {
      id
    }
  }
}
    `
export const UpdateDrugDocument = `
    mutation updateDrug($id: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $isNeonat: Boolean!, $isAntibiotic: Boolean!, $isAntiMalarial: Boolean!, $levelOfUrgency: Int, $formulationsAttributes: [FormulationInput!]!, $projectId: ID) {
  updateDrug(
    input: {params: {id: $id, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, isNeonat: $isNeonat, isAntibiotic: $isAntibiotic, isAntiMalarial: $isAntiMalarial, levelOfUrgency: $levelOfUrgency, formulationsAttributes: $formulationsAttributes, projectId: $projectId}}
  ) {
    drug {
      id
    }
  }
}
    `

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getDrugs: build.query<GetDrugsQuery, GetDrugsQueryVariables>({
      query: variables => ({ document: GetDrugsDocument, variables }),
    }),
    editDrug: build.query<EditDrugQuery, EditDrugQueryVariables>({
      query: variables => ({ document: EditDrugDocument, variables }),
    }),
    destroyDrug: build.mutation<
      DestroyDrugMutation,
      DestroyDrugMutationVariables
    >({
      query: variables => ({ document: DestroyDrugDocument, variables }),
    }),
    createDrug: build.mutation<CreateDrugMutation, CreateDrugMutationVariables>(
      {
        query: variables => ({ document: CreateDrugDocument, variables }),
      }
    ),
    updateDrug: build.mutation<UpdateDrugMutation, UpdateDrugMutationVariables>(
      {
        query: variables => ({ document: UpdateDrugDocument, variables }),
      }
    ),
  }),
})

export { injectedRtkApi as api }
