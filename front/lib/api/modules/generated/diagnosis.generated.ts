import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type DiagnosisFieldsFragment = { id: string, fullReference: string, levelOfUrgency: number, isDeployed: boolean, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null };

export type GetDiagnosisQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetDiagnosisQuery = { getDiagnosis: { decisionTreeId: string, id: string, fullReference: string, levelOfUrgency: number, isDeployed: boolean, files: Array<{ id: string, name: string, size: number, url: string, extension: string }>, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null } };

export type GetDiagnosisWithDecisionTreeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetDiagnosisWithDecisionTreeQuery = { getDiagnosis: { id: string, fullReference: string, levelOfUrgency: number, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null, decisionTree: { id: string, cutOffStart?: number | null, cutOffEnd?: number | null, labelTranslations: { en?: string | null, fr?: string | null }, node: { id: string, labelTranslations: { en?: string | null, fr?: string | null } }, algorithm: { status: Types.AlgorithmStatusEnum, name: string, id: string } } } };

export type GetDiagnosesQueryVariables = Types.Exact<{
  algorithmId: Types.Scalars['ID'];
  decisionTreeId?: Types.InputMaybe<Types.Scalars['ID']>;
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetDiagnosesQuery = { getDiagnoses: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { hasInstances: boolean, id: string, fullReference: string, levelOfUrgency: number, isDeployed: boolean, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null } }> } };

export type CreateDiagnosisMutationVariables = Types.Exact<{
  decisionTreeId: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  filesToAdd?: Types.InputMaybe<Array<Types.Scalars['Upload']> | Types.Scalars['Upload']>;
}>;


export type CreateDiagnosisMutation = { createDiagnosis: { instance?: { id: string, node: { id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { en?: string | null, fr?: string | null }, excludingNodes: Array<{ id: string }>, diagramAnswers: Array<{ id: string, labelTranslations: { en?: string | null, fr?: string | null } }> } } | null } };

export type UpdateDiagnosisMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  decisionTreeId?: Types.InputMaybe<Types.Scalars['ID']>;
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  filesToAdd?: Types.InputMaybe<Array<Types.Scalars['Upload']> | Types.Scalars['Upload']>;
  existingFilesToRemove?: Types.InputMaybe<Array<Types.Scalars['Int']> | Types.Scalars['Int']>;
}>;


export type UpdateDiagnosisMutation = { updateDiagnosis: { diagnosis?: { id: string, fullReference: string, category: string, isNeonat: boolean, labelTranslations: { en?: string | null, fr?: string | null }, excludingNodes: Array<{ id: string }>, diagramAnswers: Array<{ id: string, labelTranslations: { en?: string | null, fr?: string | null } }> } | null } };

export type DestroyDiagnosisMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyDiagnosisMutation = { destroyDiagnosis?: { id?: string | null } | null };

export const DiagnosisFieldsFragmentDoc = `
    fragment DiagnosisFields on Diagnosis {
  id
  fullReference
  labelTranslations {
    ...HstoreLanguages
  }
  descriptionTranslations {
    ...HstoreLanguages
  }
  levelOfUrgency
  isDeployed
}
    ${HstoreLanguagesFragmentDoc}`;
export const GetDiagnosisDocument = `
    query getDiagnosis($id: ID!) {
  getDiagnosis(id: $id) {
    ...DiagnosisFields
    decisionTreeId
    files {
      ...MediaFields
    }
  }
}
    ${DiagnosisFieldsFragmentDoc}
${MediaFieldsFragmentDoc}`;
export const GetDiagnosisWithDecisionTreeDocument = `
    query getDiagnosisWithDecisionTree($id: ID!) {
  getDiagnosis(id: $id) {
    id
    fullReference
    labelTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
    levelOfUrgency
    decisionTree {
      id
      labelTranslations {
        ...HstoreLanguages
      }
      node {
        id
        labelTranslations {
          ...HstoreLanguages
        }
      }
      cutOffStart
      cutOffEnd
      algorithm {
        status
        name
        id
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
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
    ${DiagnosisFieldsFragmentDoc}`;
export const CreateDiagnosisDocument = `
    mutation createDiagnosis($decisionTreeId: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $filesToAdd: [Upload!]) {
  createDiagnosis(
    input: {params: {decisionTreeId: $decisionTreeId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency}, files: $filesToAdd}
  ) {
    instance {
      id
      node {
        id
        fullReference
        labelTranslations {
          ...HstoreLanguages
        }
        excludingNodes {
          id
        }
        category
        isNeonat
        diagramAnswers {
          id
          labelTranslations {
            ...HstoreLanguages
          }
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const UpdateDiagnosisDocument = `
    mutation updateDiagnosis($id: ID!, $decisionTreeId: ID, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $filesToAdd: [Upload!], $existingFilesToRemove: [Int!]) {
  updateDiagnosis(
    input: {params: {id: $id, decisionTreeId: $decisionTreeId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency}, filesToAdd: $filesToAdd, existingFilesToRemove: $existingFilesToRemove}
  ) {
    diagnosis {
      id
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      excludingNodes {
        id
      }
      category
      isNeonat
      diagramAnswers {
        id
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const DestroyDiagnosisDocument = `
    mutation destroyDiagnosis($id: ID!) {
  destroyDiagnosis(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getDiagnosis: build.query<GetDiagnosisQuery, GetDiagnosisQueryVariables>({
      query: (variables) => ({ document: GetDiagnosisDocument, variables })
    }),
    getDiagnosisWithDecisionTree: build.query<GetDiagnosisWithDecisionTreeQuery, GetDiagnosisWithDecisionTreeQueryVariables>({
      query: (variables) => ({ document: GetDiagnosisWithDecisionTreeDocument, variables })
    }),
    getDiagnoses: build.query<GetDiagnosesQuery, GetDiagnosesQueryVariables>({
      query: (variables) => ({ document: GetDiagnosesDocument, variables })
    }),
    createDiagnosis: build.mutation<CreateDiagnosisMutation, CreateDiagnosisMutationVariables>({
      query: (variables) => ({ document: CreateDiagnosisDocument, variables })
    }),
    updateDiagnosis: build.mutation<UpdateDiagnosisMutation, UpdateDiagnosisMutationVariables>({
      query: (variables) => ({ document: UpdateDiagnosisDocument, variables })
    }),
    destroyDiagnosis: build.mutation<DestroyDiagnosisMutation, DestroyDiagnosisMutationVariables>({
      query: (variables) => ({ document: DestroyDiagnosisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


