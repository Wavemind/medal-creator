import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type DrugFieldsFragment = { id: string, fullReference: string, isNeonat: boolean, isAntibiotic: boolean, isAntiMalarial: boolean, isDefault: boolean, isDeployed: boolean, hasInstances: boolean, labelTranslations: { en?: string | null, fr?: string | null } };

export type GetDrugsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetDrugsQuery = { getDrugs: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, fullReference: string, isNeonat: boolean, isAntibiotic: boolean, isAntiMalarial: boolean, isDefault: boolean, isDeployed: boolean, hasInstances: boolean, labelTranslations: { en?: string | null, fr?: string | null } } }> } };

export type GetDrugQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetDrugQuery = { getDrug: { id: string, isDeployed: boolean, labelTranslations: { en?: string | null, fr?: string | null }, excludedNodes: Array<{ id: string, isDeployed: boolean, labelTranslations: { en?: string | null, fr?: string | null } }> } };

export type EditDrugQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type EditDrugQuery = { getDrug: { id: string, isNeonat: boolean, isAntibiotic: boolean, isAntiMalarial: boolean, isDefault: boolean, isDeployed: boolean, hasInstances: boolean, levelOfUrgency: number, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null, formulations: Array<{ id: string, byAge?: boolean | null, breakable?: Types.BreakableEnum | null, uniqueDose?: number | null, liquidConcentration?: number | null, medicationForm: Types.MedicationFormEnum, doseForm?: number | null, maximalDose?: number | null, minimalDosePerKg?: number | null, maximalDosePerKg?: number | null, dosesPerDay?: number | null, administrationRoute: { id: string, category: string, nameTranslations: { en?: string | null, fr?: string | null } }, injectionInstructionsTranslations?: { en?: string | null, fr?: string | null } | null, dispensingDescriptionTranslations?: { en?: string | null, fr?: string | null } | null, descriptionTranslations?: { en?: string | null, fr?: string | null } | null }> } };

export type DestroyDrugMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyDrugMutation = { destroyDrug?: { id?: string | null } | null };

export type CreateDrugMutationVariables = Types.Exact<{
  labelTranslations: Types.HstoreInput;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  isNeonat?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isAntibiotic: Types.Scalars['Boolean'];
  isAntiMalarial: Types.Scalars['Boolean'];
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  formulationsAttributes: Array<Types.FormulationInput> | Types.FormulationInput;
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type CreateDrugMutation = { createDrug: { drug?: { id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { en?: string | null, fr?: string | null } } | null } };

export type UpdateDrugMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  isNeonat?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isAntibiotic: Types.Scalars['Boolean'];
  isAntiMalarial: Types.Scalars['Boolean'];
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  formulationsAttributes: Array<Types.FormulationInput> | Types.FormulationInput;
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type UpdateDrugMutation = { updateDrug: { drug?: { id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { en?: string | null, fr?: string | null } } | null } };

export const DrugFieldsFragmentDoc = `
    fragment DrugFields on Drug {
  id
  fullReference
  isNeonat
  isAntibiotic
  isAntiMalarial
  isDefault
  isDeployed
  hasInstances
  labelTranslations {
    ...HstoreLanguages
  }
}
    ${HstoreLanguagesFragmentDoc}`;
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
        ...DrugFields
      }
    }
  }
}
    ${DrugFieldsFragmentDoc}`;
export const GetDrugDocument = `
    query getDrug($id: ID!) {
  getDrug(id: $id) {
    id
    isDeployed
    labelTranslations {
      ...HstoreLanguages
    }
    excludedNodes {
      id
      isDeployed
      labelTranslations {
        ...HstoreLanguages
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const EditDrugDocument = `
    query editDrug($id: ID!) {
  getDrug(id: $id) {
    id
    isNeonat
    isAntibiotic
    isAntiMalarial
    isDefault
    isDeployed
    hasInstances
    labelTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
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
          ...HstoreLanguages
        }
      }
      injectionInstructionsTranslations {
        ...HstoreLanguages
      }
      dispensingDescriptionTranslations {
        ...HstoreLanguages
      }
      descriptionTranslations {
        ...HstoreLanguages
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const DestroyDrugDocument = `
    mutation destroyDrug($id: ID!) {
  destroyDrug(input: {id: $id}) {
    id
  }
}
    `;
export const CreateDrugDocument = `
    mutation createDrug($labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $isNeonat: Boolean, $isAntibiotic: Boolean!, $isAntiMalarial: Boolean!, $levelOfUrgency: Int, $formulationsAttributes: [FormulationInput!]!, $projectId: ID) {
  createDrug(
    input: {params: {labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, isNeonat: $isNeonat, isAntibiotic: $isAntibiotic, isAntiMalarial: $isAntiMalarial, levelOfUrgency: $levelOfUrgency, formulationsAttributes: $formulationsAttributes, projectId: $projectId}}
  ) {
    drug {
      id
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      category
      isNeonat
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const UpdateDrugDocument = `
    mutation updateDrug($id: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $isNeonat: Boolean, $isAntibiotic: Boolean!, $isAntiMalarial: Boolean!, $levelOfUrgency: Int, $formulationsAttributes: [FormulationInput!]!, $projectId: ID) {
  updateDrug(
    input: {params: {id: $id, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, isNeonat: $isNeonat, isAntibiotic: $isAntibiotic, isAntiMalarial: $isAntiMalarial, levelOfUrgency: $levelOfUrgency, formulationsAttributes: $formulationsAttributes, projectId: $projectId}}
  ) {
    drug {
      id
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      category
      isNeonat
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getDrugs: build.query<GetDrugsQuery, GetDrugsQueryVariables>({
      query: (variables) => ({ document: GetDrugsDocument, variables })
    }),
    getDrug: build.query<GetDrugQuery, GetDrugQueryVariables>({
      query: (variables) => ({ document: GetDrugDocument, variables })
    }),
    editDrug: build.query<EditDrugQuery, EditDrugQueryVariables>({
      query: (variables) => ({ document: EditDrugDocument, variables })
    }),
    destroyDrug: build.mutation<DestroyDrugMutation, DestroyDrugMutationVariables>({
      query: (variables) => ({ document: DestroyDrugDocument, variables })
    }),
    createDrug: build.mutation<CreateDrugMutation, CreateDrugMutationVariables>({
      query: (variables) => ({ document: CreateDrugDocument, variables })
    }),
    updateDrug: build.mutation<UpdateDrugMutation, UpdateDrugMutationVariables>({
      query: (variables) => ({ document: UpdateDrugDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


