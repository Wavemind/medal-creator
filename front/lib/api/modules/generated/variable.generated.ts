import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetVariablesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetVariablesQuery = { getVariables: { __typename?: 'VariableConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'VariableEdge', node: { __typename?: 'Variable', id: string, isNeonat: boolean, hasInstances?: boolean | null, type: Types.VariableCategoryEnum, labelTranslations: { __typename?: 'Hstore', en: string, fr: string }, answerType: { __typename?: 'AnswerType', value: string } } }> } };

export type GetVariableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetVariableQuery = { getVariable: { __typename?: 'Variable', id: string, isMandatory: boolean, dependenciesByAlgorithm?: any | null, labelTranslations: { __typename?: 'Hstore', en: string, fr: string }, descriptionTranslations?: { __typename?: 'Hstore', en: string, fr: string } | null } };

export type CreateVariableMutationVariables = Types.Exact<{
  labelTranslations: Types.HstoreInput;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  answersAttributes: Array<Types.AnswerInput> | Types.AnswerInput;
  complaintCategoryIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  answerType: Types.Scalars['ID'];
  type: Types.Scalars['String'];
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
  system?: Types.InputMaybe<Types.SystemEnum>;
  formula?: Types.InputMaybe<Types.Scalars['String']>;
  round?: Types.InputMaybe<Types.RoundEnum>;
  isMandatory?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isUnavailable?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isEstimable?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isNeonat?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isIdentifiable?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isPreFill?: Types.InputMaybe<Types.Scalars['Boolean']>;
  emergencyStatus?: Types.InputMaybe<Types.EmergencyStatusEnum>;
  minValueWarning?: Types.InputMaybe<Types.Scalars['Int']>;
  maxValueWarning?: Types.InputMaybe<Types.Scalars['Int']>;
  minValueError?: Types.InputMaybe<Types.Scalars['Int']>;
  maxValueError?: Types.InputMaybe<Types.Scalars['Int']>;
  minMessageErrorTranslations?: Types.InputMaybe<Types.HstoreInput>;
  maxMessageErrorTranslations?: Types.InputMaybe<Types.HstoreInput>;
  minMessageWarningTranslations?: Types.InputMaybe<Types.HstoreInput>;
  maxMessageWarningTranslations?: Types.InputMaybe<Types.HstoreInput>;
  placeholderTranslations?: Types.InputMaybe<Types.HstoreInput>;
  filesToAdd?: Types.InputMaybe<Array<Types.Scalars['Upload']> | Types.Scalars['Upload']>;
}>;


export type CreateVariableMutation = { createVariable?: { __typename?: 'CreateVariablePayload', variable?: { __typename?: 'Variable', id: string } | null } | null };

export type DuplicateVariableMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DuplicateVariableMutation = { duplicateVariable?: { __typename?: 'DuplicateVariablePayload', id?: string | null } | null };

export type DestroyVariableMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyVariableMutation = { destroyVariable?: { __typename?: 'DestroyVariablePayload', id?: string | null } | null };


export const GetVariablesDocument = `
    query getVariables($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getVariables(
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
        hasInstances
        labelTranslations {
          en
          fr
        }
        answerType {
          value
        }
        type
      }
    }
  }
}
    `;
export const GetVariableDocument = `
    query getVariable($id: ID!) {
  getVariable(id: $id) {
    id
    isMandatory
    labelTranslations {
      en
      fr
    }
    descriptionTranslations {
      en
      fr
    }
    dependenciesByAlgorithm
  }
}
    `;
export const CreateVariableDocument = `
    mutation createVariable($labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $answersAttributes: [AnswerInput!]!, $complaintCategoryIds: [ID!], $answerType: ID!, $type: String!, $projectId: ID, $system: SystemEnum, $formula: String, $round: RoundEnum, $isMandatory: Boolean, $isUnavailable: Boolean, $isEstimable: Boolean, $isNeonat: Boolean, $isIdentifiable: Boolean, $isPreFill: Boolean, $emergencyStatus: EmergencyStatusEnum, $minValueWarning: Int, $maxValueWarning: Int, $minValueError: Int, $maxValueError: Int, $minMessageErrorTranslations: HstoreInput, $maxMessageErrorTranslations: HstoreInput, $minMessageWarningTranslations: HstoreInput, $maxMessageWarningTranslations: HstoreInput, $placeholderTranslations: HstoreInput, $filesToAdd: [Upload!]) {
  createVariable(
    input: {params: {labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, answersAttributes: $answersAttributes, complaintCategoryIds: $complaintCategoryIds, answerTypeId: $answerType, type: $type, projectId: $projectId, system: $system, formula: $formula, round: $round, isMandatory: $isMandatory, isUnavailable: $isUnavailable, isEstimable: $isEstimable, isNeonat: $isNeonat, isIdentifiable: $isIdentifiable, isPreFill: $isPreFill, emergencyStatus: $emergencyStatus, minValueWarning: $minValueWarning, maxValueWarning: $maxValueWarning, minValueError: $minValueError, maxValueError: $maxValueError, minMessageErrorTranslations: $minMessageErrorTranslations, maxMessageErrorTranslations: $maxMessageErrorTranslations, minMessageWarningTranslations: $minMessageWarningTranslations, maxMessageWarningTranslations: $maxMessageWarningTranslations, placeholderTranslations: $placeholderTranslations}, files: $filesToAdd}
  ) {
    variable {
      id
    }
  }
}
    `;
export const DuplicateVariableDocument = `
    mutation duplicateVariable($id: ID!) {
  duplicateVariable(input: {id: $id}) {
    id
  }
}
    `;
export const DestroyVariableDocument = `
    mutation destroyVariable($id: ID!) {
  destroyVariable(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getVariables: build.query<GetVariablesQuery, GetVariablesQueryVariables>({
      query: (variables) => ({ document: GetVariablesDocument, variables })
    }),
    getVariable: build.query<GetVariableQuery, GetVariableQueryVariables>({
      query: (variables) => ({ document: GetVariableDocument, variables })
    }),
    createVariable: build.mutation<CreateVariableMutation, CreateVariableMutationVariables>({
      query: (variables) => ({ document: CreateVariableDocument, variables })
    }),
    duplicateVariable: build.mutation<DuplicateVariableMutation, DuplicateVariableMutationVariables>({
      query: (variables) => ({ document: DuplicateVariableDocument, variables })
    }),
    destroyVariable: build.mutation<DestroyVariableMutation, DestroyVariableMutationVariables>({
      query: (variables) => ({ document: DestroyVariableDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


