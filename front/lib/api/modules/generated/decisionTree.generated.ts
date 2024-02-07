import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetDecisionTreeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetDecisionTreeQuery = { getDecisionTree: { id: string, cutOffStart?: number | null, cutOffEnd?: number | null, labelTranslations: { en?: string | null, fr?: string | null }, node: { id: string, labelTranslations: { en?: string | null, fr?: string | null } }, algorithm: { status: Types.AlgorithmStatusEnum, name: string, id: string } } };

export type GetDecisionTreesQueryVariables = Types.Exact<{
  algorithmId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetDecisionTreesQuery = { getDecisionTrees: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, fullReference: string, cutOffStart?: number | null, cutOffEnd?: number | null, labelTranslations: { en?: string | null, fr?: string | null }, node: { labelTranslations: { en?: string | null, fr?: string | null } } } }> } };

export type CreateDecisionTreeMutationVariables = Types.Exact<{
  algorithmId: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  nodeId: Types.Scalars['ID'];
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffValueType?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type CreateDecisionTreeMutation = { createDecisionTree: { decisionTree?: { id: string } | null } };

export type UpdateDecisionTreeMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  nodeId: Types.Scalars['ID'];
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffValueType?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UpdateDecisionTreeMutation = { updateDecisionTree?: { decisionTree?: { id: string } | null } | null };

export type DestroyDecisionTreeMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyDecisionTreeMutation = { destroyDecisionTree?: { id?: string | null } | null };

export type DuplicateDecisionTreeMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DuplicateDecisionTreeMutation = { duplicateDecisionTree?: { id?: string | null } | null };


export const GetDecisionTreeDocument = `
    query getDecisionTree($id: ID!) {
  getDecisionTree(id: $id) {
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
    ${HstoreLanguagesFragmentDoc}`;
export const GetDecisionTreesDocument = `
    query getDecisionTrees($algorithmId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getDecisionTrees(
    algorithmId: $algorithmId
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
        fullReference
        cutOffStart
        cutOffEnd
        labelTranslations {
          ...HstoreLanguages
        }
        node {
          labelTranslations {
            ...HstoreLanguages
          }
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const CreateDecisionTreeDocument = `
    mutation createDecisionTree($algorithmId: ID!, $labelTranslations: HstoreInput!, $nodeId: ID!, $cutOffStart: Int, $cutOffEnd: Int, $cutOffValueType: String) {
  createDecisionTree(
    input: {params: {algorithmId: $algorithmId, labelTranslations: $labelTranslations, nodeId: $nodeId, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, cutOffValueType: $cutOffValueType}}
  ) {
    decisionTree {
      id
    }
  }
}
    `;
export const UpdateDecisionTreeDocument = `
    mutation updateDecisionTree($id: ID!, $labelTranslations: HstoreInput!, $nodeId: ID!, $cutOffStart: Int, $cutOffEnd: Int, $cutOffValueType: String) {
  updateDecisionTree(
    input: {params: {id: $id, labelTranslations: $labelTranslations, nodeId: $nodeId, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, cutOffValueType: $cutOffValueType}}
  ) {
    decisionTree {
      id
    }
  }
}
    `;
export const DestroyDecisionTreeDocument = `
    mutation destroyDecisionTree($id: ID!) {
  destroyDecisionTree(input: {id: $id}) {
    id
  }
}
    `;
export const DuplicateDecisionTreeDocument = `
    mutation duplicateDecisionTree($id: ID!) {
  duplicateDecisionTree(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getDecisionTree: build.query<GetDecisionTreeQuery, GetDecisionTreeQueryVariables>({
      query: (variables) => ({ document: GetDecisionTreeDocument, variables })
    }),
    getDecisionTrees: build.query<GetDecisionTreesQuery, GetDecisionTreesQueryVariables>({
      query: (variables) => ({ document: GetDecisionTreesDocument, variables })
    }),
    createDecisionTree: build.mutation<CreateDecisionTreeMutation, CreateDecisionTreeMutationVariables>({
      query: (variables) => ({ document: CreateDecisionTreeDocument, variables })
    }),
    updateDecisionTree: build.mutation<UpdateDecisionTreeMutation, UpdateDecisionTreeMutationVariables>({
      query: (variables) => ({ document: UpdateDecisionTreeDocument, variables })
    }),
    destroyDecisionTree: build.mutation<DestroyDecisionTreeMutation, DestroyDecisionTreeMutationVariables>({
      query: (variables) => ({ document: DestroyDecisionTreeDocument, variables })
    }),
    duplicateDecisionTree: build.mutation<DuplicateDecisionTreeMutation, DuplicateDecisionTreeMutationVariables>({
      query: (variables) => ({ document: DuplicateDecisionTreeDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


