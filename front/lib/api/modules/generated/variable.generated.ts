import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type VariableFieldsFragment = { __typename?: 'Variable', id: string, fullReference: string, category: string, isDeployed: boolean, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> };

export type GetVariablesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetVariablesQuery = { getVariables: { __typename?: 'VariableConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'VariableEdge', node: { __typename?: 'Variable', id: string, fullReference: string, isNeonat: boolean, hasInstances: boolean, isDefault: boolean, type: Types.VariableCategoryEnum, conditionedByCcs?: Array<{ __typename?: 'NodeComplaintCategory', complaintCategory: { __typename?: 'Variable', labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, answerType: { __typename?: 'AnswerType', value: string, labelKey: string } } }> } };

export type GetFormulaVariablesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  answerType: Types.FormulaAnswerTypeEnum;
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetFormulaVariablesQuery = { getFormulaVariables: { __typename?: 'VariableConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'VariableEdge', node: { __typename?: 'Variable', id: string, fullReference: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> } };

export type GetVariableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetVariableQuery = { getVariable: { __typename?: 'Variable', id: string, isMandatory: boolean, dependenciesByAlgorithm?: any | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null } };

export type ValidateFormulaQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  formula: Types.Scalars['String'];
}>;


export type ValidateFormulaQuery = { validateFormula: { __typename?: 'Validate', errors: Array<string> } };

export type CreateVariableMutationVariables = Types.Exact<{
  labelTranslations: Types.HstoreInput;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  answersAttributes: Array<Types.AnswerInput> | Types.AnswerInput;
  complaintCategoryIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  answerTypeId: Types.Scalars['ID'];
  type: Types.VariableCategoryEnum;
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


export type CreateVariableMutation = { createVariable: { __typename?: 'CreateVariablePayload', variable?: { __typename?: 'Variable', id: string, fullReference: string, category: string, isDeployed: boolean, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } | null } };

export type EditVariableQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type EditVariableQuery = { getVariable: { __typename?: 'Variable', isDeployed: boolean, hasInstances: boolean, type: Types.VariableCategoryEnum, system?: Types.SystemEnum | null, formula?: string | null, round?: Types.RoundEnum | null, isMandatory: boolean, isUnavailable: boolean, isEstimable: boolean, isNeonat: boolean, isIdentifiable: boolean, isPreFill: boolean, emergencyStatus?: Types.EmergencyStatusEnum | null, minValueWarning?: number | null, maxValueWarning?: number | null, minValueError?: number | null, maxValueError?: number | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, answers: Array<{ __typename?: 'Answer', id: string, operator?: Types.OperatorEnum | null, value?: string | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }>, conditionedByCcs?: Array<{ __typename?: 'NodeComplaintCategory', complaintCategory: { __typename?: 'Variable', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> | null, answerType: { __typename?: 'AnswerType', id: string }, minMessageErrorTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, maxMessageErrorTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, minMessageWarningTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, maxMessageWarningTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, placeholderTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, files: Array<{ __typename?: 'File', id: string, name: string, size: number, url: string, extension: string }> } };

export type UpdateVariableMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  answersAttributes: Array<Types.AnswerInput> | Types.AnswerInput;
  complaintCategoryIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  answerTypeId: Types.Scalars['ID'];
  type: Types.VariableCategoryEnum;
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
  existingFilesToRemove?: Types.InputMaybe<Array<Types.Scalars['Int']> | Types.Scalars['Int']>;
}>;


export type UpdateVariableMutation = { updateVariable: { __typename?: 'UpdateVariablePayload', variable?: { __typename?: 'Variable', id: string, fullReference: string, category: string, isDeployed: boolean, isNeonat: boolean, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, excludingNodes: Array<{ __typename?: 'Node', id: string }>, diagramAnswers: Array<{ __typename?: 'Answer', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } | null } };

export type DuplicateVariableMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DuplicateVariableMutation = { duplicateVariable?: { __typename?: 'DuplicateVariablePayload', id?: string | null } | null };

export type DestroyVariableMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyVariableMutation = { destroyVariable?: { __typename?: 'DestroyVariablePayload', id?: string | null } | null };

export const VariableFieldsFragmentDoc = `
    fragment VariableFields on Variable {
  id
  fullReference
  labelTranslations {
    ...HstoreLanguages
  }
  excludingNodes {
    id
  }
  category
  isDeployed
  isNeonat
  diagramAnswers {
    id
    labelTranslations {
      ...HstoreLanguages
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
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
        fullReference
        isNeonat
        hasInstances
        conditionedByCcs {
          complaintCategory {
            labelTranslations {
              ...HstoreLanguages
            }
          }
        }
        isDefault
        labelTranslations {
          ...HstoreLanguages
        }
        answerType {
          value
          labelKey
        }
        type
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const GetFormulaVariablesDocument = `
    query getFormulaVariables($projectId: ID!, $answerType: FormulaAnswerTypeEnum!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getFormulaVariables(
    projectId: $projectId
    answerType: $answerType
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
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const GetVariableDocument = `
    query getVariable($id: ID!) {
  getVariable(id: $id) {
    id
    isMandatory
    labelTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
    dependenciesByAlgorithm
  }
}
    ${HstoreLanguagesFragmentDoc}`;
export const ValidateFormulaDocument = `
    query validateFormula($projectId: ID!, $formula: String!) {
  validateFormula(projectId: $projectId, formula: $formula) {
    errors
  }
}
    `;
export const CreateVariableDocument = `
    mutation createVariable($labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $answersAttributes: [AnswerInput!]!, $complaintCategoryIds: [ID!], $answerTypeId: ID!, $type: VariableCategoryEnum!, $projectId: ID, $system: SystemEnum, $formula: String, $round: RoundEnum, $isMandatory: Boolean, $isUnavailable: Boolean, $isEstimable: Boolean, $isNeonat: Boolean, $isIdentifiable: Boolean, $isPreFill: Boolean, $emergencyStatus: EmergencyStatusEnum, $minValueWarning: Int, $maxValueWarning: Int, $minValueError: Int, $maxValueError: Int, $minMessageErrorTranslations: HstoreInput, $maxMessageErrorTranslations: HstoreInput, $minMessageWarningTranslations: HstoreInput, $maxMessageWarningTranslations: HstoreInput, $placeholderTranslations: HstoreInput, $filesToAdd: [Upload!]) {
  createVariable(
    input: {params: {labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, answersAttributes: $answersAttributes, complaintCategoryIds: $complaintCategoryIds, answerTypeId: $answerTypeId, type: $type, projectId: $projectId, system: $system, formula: $formula, round: $round, isMandatory: $isMandatory, isUnavailable: $isUnavailable, isEstimable: $isEstimable, isNeonat: $isNeonat, isIdentifiable: $isIdentifiable, isPreFill: $isPreFill, emergencyStatus: $emergencyStatus, minValueWarning: $minValueWarning, maxValueWarning: $maxValueWarning, minValueError: $minValueError, maxValueError: $maxValueError, minMessageErrorTranslations: $minMessageErrorTranslations, maxMessageErrorTranslations: $maxMessageErrorTranslations, minMessageWarningTranslations: $minMessageWarningTranslations, maxMessageWarningTranslations: $maxMessageWarningTranslations, placeholderTranslations: $placeholderTranslations}, files: $filesToAdd}
  ) {
    variable {
      ...VariableFields
    }
  }
}
    ${VariableFieldsFragmentDoc}`;
export const EditVariableDocument = `
    query editVariable($id: ID!) {
  getVariable(id: $id) {
    labelTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
    answers {
      id
      labelTranslations {
        en
        fr
      }
      operator
      value
    }
    conditionedByCcs {
      complaintCategory {
        id
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
    answerType {
      id
    }
    isDeployed
    hasInstances
    type
    system
    formula
    round
    isMandatory
    isUnavailable
    isEstimable
    isNeonat
    isIdentifiable
    isPreFill
    emergencyStatus
    minValueWarning
    maxValueWarning
    minValueError
    maxValueError
    minMessageErrorTranslations {
      ...HstoreLanguages
    }
    maxMessageErrorTranslations {
      ...HstoreLanguages
    }
    minMessageWarningTranslations {
      ...HstoreLanguages
    }
    maxMessageWarningTranslations {
      ...HstoreLanguages
    }
    placeholderTranslations {
      ...HstoreLanguages
    }
    files {
      ...MediaFields
    }
  }
}
    ${HstoreLanguagesFragmentDoc}
${MediaFieldsFragmentDoc}`;
export const UpdateVariableDocument = `
    mutation updateVariable($id: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput, $answersAttributes: [AnswerInput!]!, $complaintCategoryIds: [ID!], $answerTypeId: ID!, $type: VariableCategoryEnum!, $projectId: ID, $system: SystemEnum, $formula: String, $round: RoundEnum, $isMandatory: Boolean, $isUnavailable: Boolean, $isEstimable: Boolean, $isNeonat: Boolean, $isIdentifiable: Boolean, $isPreFill: Boolean, $emergencyStatus: EmergencyStatusEnum, $minValueWarning: Int, $maxValueWarning: Int, $minValueError: Int, $maxValueError: Int, $minMessageErrorTranslations: HstoreInput, $maxMessageErrorTranslations: HstoreInput, $minMessageWarningTranslations: HstoreInput, $maxMessageWarningTranslations: HstoreInput, $placeholderTranslations: HstoreInput, $filesToAdd: [Upload!], $existingFilesToRemove: [Int!]) {
  updateVariable(
    input: {params: {id: $id, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, answersAttributes: $answersAttributes, complaintCategoryIds: $complaintCategoryIds, answerTypeId: $answerTypeId, type: $type, projectId: $projectId, system: $system, formula: $formula, round: $round, isMandatory: $isMandatory, isUnavailable: $isUnavailable, isEstimable: $isEstimable, isNeonat: $isNeonat, isIdentifiable: $isIdentifiable, isPreFill: $isPreFill, emergencyStatus: $emergencyStatus, minValueWarning: $minValueWarning, maxValueWarning: $maxValueWarning, minValueError: $minValueError, maxValueError: $maxValueError, minMessageErrorTranslations: $minMessageErrorTranslations, maxMessageErrorTranslations: $maxMessageErrorTranslations, minMessageWarningTranslations: $minMessageWarningTranslations, maxMessageWarningTranslations: $maxMessageWarningTranslations, placeholderTranslations: $placeholderTranslations}, filesToAdd: $filesToAdd, existingFilesToRemove: $existingFilesToRemove}
  ) {
    variable {
      ...VariableFields
    }
  }
}
    ${VariableFieldsFragmentDoc}`;
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
    getFormulaVariables: build.query<GetFormulaVariablesQuery, GetFormulaVariablesQueryVariables>({
      query: (variables) => ({ document: GetFormulaVariablesDocument, variables })
    }),
    getVariable: build.query<GetVariableQuery, GetVariableQueryVariables>({
      query: (variables) => ({ document: GetVariableDocument, variables })
    }),
    validateFormula: build.query<ValidateFormulaQuery, ValidateFormulaQueryVariables>({
      query: (variables) => ({ document: ValidateFormulaDocument, variables })
    }),
    createVariable: build.mutation<CreateVariableMutation, CreateVariableMutationVariables>({
      query: (variables) => ({ document: CreateVariableDocument, variables })
    }),
    editVariable: build.query<EditVariableQuery, EditVariableQueryVariables>({
      query: (variables) => ({ document: EditVariableDocument, variables })
    }),
    updateVariable: build.mutation<UpdateVariableMutation, UpdateVariableMutationVariables>({
      query: (variables) => ({ document: UpdateVariableDocument, variables })
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


