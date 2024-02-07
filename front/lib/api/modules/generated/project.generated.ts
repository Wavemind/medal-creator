import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type ProjectFieldsFragment = { id: string, name: string, isCurrentUserAdmin?: boolean | null };

export type GetProjectsQueryVariables = Types.Exact<{
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetProjectsQuery = { getProjects: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, name: string, isCurrentUserAdmin?: boolean | null } }> } };

export type GetProjectQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProjectQuery = { getProject: { id: string, name: string, isCurrentUserAdmin?: boolean | null, language: { code: string } } };

export type GetProjectSummaryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProjectSummaryQuery = { getProject: { id: string, algorithmsCount?: number | null, drugsCount?: number | null, variablesCount?: number | null, managementsCount?: number | null, questionsSequencesCount?: number | null } };

export type GetLastUpdatedDecisionTreesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetLastUpdatedDecisionTreesQuery = { getLastUpdatedDecisionTrees: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, fullReference: string, updatedAt?: any | null, labelTranslations: { en?: string | null, fr?: string | null }, algorithm: { name: string }, node: { labelTranslations: { en?: string | null, fr?: string | null } } } }> } };

export type EditProjectQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type EditProjectQuery = { getProject: { name: string, description?: string | null, consentManagement: boolean, trackReferral: boolean, id: string, isCurrentUserAdmin?: boolean | null, language: { id: string }, emergencyContentTranslations?: { en?: string | null, fr?: string | null } | null, studyDescriptionTranslations?: { en?: string | null, fr?: string | null } | null, userProjects: Array<{ id: string, userId: string, isAdmin: boolean }> } };

export type CreateProjectMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  description?: Types.InputMaybe<Types.Scalars['String']>;
  consentManagement?: Types.InputMaybe<Types.Scalars['Boolean']>;
  trackReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
  villages?: Types.InputMaybe<Types.Scalars['Upload']>;
  languageId: Types.Scalars['ID'];
  emergencyContentTranslations?: Types.InputMaybe<Types.HstoreInput>;
  studyDescriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  userProjectsAttributes: Array<Types.UserProjectInput> | Types.UserProjectInput;
}>;


export type CreateProjectMutation = { createProject: { project: { id: string } } };

export type UpdateProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  name: Types.Scalars['String'];
  description?: Types.InputMaybe<Types.Scalars['String']>;
  consentManagement?: Types.InputMaybe<Types.Scalars['Boolean']>;
  trackReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
  villages?: Types.InputMaybe<Types.Scalars['Upload']>;
  languageId: Types.Scalars['ID'];
  emergencyContentTranslations?: Types.InputMaybe<Types.HstoreInput>;
  studyDescriptionTranslations?: Types.InputMaybe<Types.HstoreInput>;
  userProjectsAttributes: Array<Types.UserProjectInput> | Types.UserProjectInput;
}>;


export type UpdateProjectMutation = { updateProject?: { project?: { id: string } | null } | null };

export type UnsubscribeFromProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UnsubscribeFromProjectMutation = { unsubscribeFromProject?: { project?: { id: string } | null } | null };

export const ProjectFieldsFragmentDoc = `
    fragment ProjectFields on Project {
  id
  name
  isCurrentUserAdmin
}
    `;
export const GetProjectsDocument = `
    query getProjects($searchTerm: String) {
  getProjects(searchTerm: $searchTerm) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    totalCount
    edges {
      node {
        ...ProjectFields
      }
    }
  }
}
    ${ProjectFieldsFragmentDoc}`;
export const GetProjectDocument = `
    query getProject($id: ID!) {
  getProject(id: $id) {
    ...ProjectFields
    language {
      code
    }
  }
}
    ${ProjectFieldsFragmentDoc}`;
export const GetProjectSummaryDocument = `
    query getProjectSummary($id: ID!) {
  getProject(id: $id) {
    id
    algorithmsCount
    drugsCount
    variablesCount
    managementsCount
    questionsSequencesCount
  }
}
    `;
export const GetLastUpdatedDecisionTreesDocument = `
    query getLastUpdatedDecisionTrees($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getLastUpdatedDecisionTrees(
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
        updatedAt
        labelTranslations {
          ...HstoreLanguages
        }
        algorithm {
          name
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
export const EditProjectDocument = `
    query editProject($id: ID!) {
  getProject(id: $id) {
    ...ProjectFields
    name
    description
    consentManagement
    trackReferral
    language {
      id
    }
    emergencyContentTranslations {
      ...HstoreLanguages
    }
    studyDescriptionTranslations {
      ...HstoreLanguages
    }
    userProjects {
      id
      userId
      isAdmin
    }
  }
}
    ${ProjectFieldsFragmentDoc}
${HstoreLanguagesFragmentDoc}`;
export const CreateProjectDocument = `
    mutation createProject($name: String!, $description: String, $consentManagement: Boolean, $trackReferral: Boolean, $villages: Upload, $languageId: ID!, $emergencyContentTranslations: HstoreInput, $studyDescriptionTranslations: HstoreInput, $userProjectsAttributes: [UserProjectInput!]!) {
  createProject(
    input: {params: {name: $name, description: $description, consentManagement: $consentManagement, trackReferral: $trackReferral, languageId: $languageId, emergencyContentTranslations: $emergencyContentTranslations, studyDescriptionTranslations: $studyDescriptionTranslations, userProjectsAttributes: $userProjectsAttributes}, villages: $villages}
  ) {
    project {
      id
    }
  }
}
    `;
export const UpdateProjectDocument = `
    mutation updateProject($id: ID!, $name: String!, $description: String, $consentManagement: Boolean, $trackReferral: Boolean, $villages: Upload, $languageId: ID!, $emergencyContentTranslations: HstoreInput, $studyDescriptionTranslations: HstoreInput, $userProjectsAttributes: [UserProjectInput!]!) {
  updateProject(
    input: {params: {id: $id, name: $name, description: $description, consentManagement: $consentManagement, trackReferral: $trackReferral, languageId: $languageId, emergencyContentTranslations: $emergencyContentTranslations, studyDescriptionTranslations: $studyDescriptionTranslations, userProjectsAttributes: $userProjectsAttributes}, villages: $villages}
  ) {
    project {
      id
    }
  }
}
    `;
export const UnsubscribeFromProjectDocument = `
    mutation unsubscribeFromProject($id: ID!) {
  unsubscribeFromProject(input: {id: $id}) {
    project {
      id
    }
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<GetProjectsQuery, GetProjectsQueryVariables | void>({
      query: (variables) => ({ document: GetProjectsDocument, variables })
    }),
    getProject: build.query<GetProjectQuery, GetProjectQueryVariables>({
      query: (variables) => ({ document: GetProjectDocument, variables })
    }),
    getProjectSummary: build.query<GetProjectSummaryQuery, GetProjectSummaryQueryVariables>({
      query: (variables) => ({ document: GetProjectSummaryDocument, variables })
    }),
    getLastUpdatedDecisionTrees: build.query<GetLastUpdatedDecisionTreesQuery, GetLastUpdatedDecisionTreesQueryVariables>({
      query: (variables) => ({ document: GetLastUpdatedDecisionTreesDocument, variables })
    }),
    editProject: build.query<EditProjectQuery, EditProjectQueryVariables>({
      query: (variables) => ({ document: EditProjectDocument, variables })
    }),
    createProject: build.mutation<CreateProjectMutation, CreateProjectMutationVariables>({
      query: (variables) => ({ document: CreateProjectDocument, variables })
    }),
    updateProject: build.mutation<UpdateProjectMutation, UpdateProjectMutationVariables>({
      query: (variables) => ({ document: UpdateProjectDocument, variables })
    }),
    unsubscribeFromProject: build.mutation<UnsubscribeFromProjectMutation, UnsubscribeFromProjectMutationVariables>({
      query: (variables) => ({ document: UnsubscribeFromProjectDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


