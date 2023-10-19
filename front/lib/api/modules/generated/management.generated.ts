import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetManagementQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetManagementQuery = { getManagement: { __typename?: 'Management', id: string, isNeonat: boolean, isReferral?: boolean | null, levelOfUrgency?: number | null, isDefault: boolean, hasInstances?: boolean | null, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, files: Array<{ __typename?: 'File', id: string, name: string, size: number, url: string, extension: string }>, excludedNodes: Array<{ __typename?: 'Node', id: string, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } }> } };

export type GetManagementsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetManagementsQuery = { getManagements: { __typename?: 'ManagementConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'ManagementEdge', node: { __typename?: 'Management', id: string, fullReference: string, isNeonat: boolean, isReferral?: boolean | null, levelOfUrgency?: number | null, isDefault: boolean, hasInstances?: boolean | null, descriptionTranslations?: { __typename?: 'Hstore', en?: string | null, fr?: string | null } | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null }, files: Array<{ __typename?: 'File', id: string, name: string, size: number, url: string, extension: string }> } }> } };

export type CreateManagementMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  isNeonat?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
  filesToAdd?: Types.InputMaybe<Array<Types.Scalars['Upload']> | Types.Scalars['Upload']>;
}>;


export type CreateManagementMutation = { createManagement?: { __typename?: 'CreateManagementPayload', management?: { __typename?: 'Management', id: string } | null } | null };

export type UpdateManagementMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  levelOfUrgency?: Types.InputMaybe<Types.Scalars['Int']>;
  isNeonat?: Types.InputMaybe<Types.Scalars['Boolean']>;
  isReferral?: Types.InputMaybe<Types.Scalars['Boolean']>;
  filesToAdd?: Types.InputMaybe<Array<Types.Scalars['Upload']> | Types.Scalars['Upload']>;
  existingFilesToRemove?: Types.InputMaybe<Array<Types.Scalars['Int']> | Types.Scalars['Int']>;
  projectId?: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type UpdateManagementMutation = { updateManagement?: { __typename?: 'UpdateManagementPayload', management?: { __typename?: 'Management', id: string } | null } | null };

export type DestroyManagementMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyManagementMutation = { destroyManagement?: { __typename?: 'DestroyManagementPayload', id?: string | null } | null };


export const GetManagementDocument = `
    query getManagement($id: ID!) {
  getManagement(id: $id) {
    id
    descriptionTranslations {
      ...HstoreLanguages
    }
    labelTranslations {
      ...HstoreLanguages
    }
    isNeonat
    isReferral
    levelOfUrgency
    isDefault
    hasInstances
    files {
      ...MediaFields
    }
    excludedNodes {
      id
      labelTranslations {
        ...HstoreLanguages
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}
${MediaFieldsFragmentDoc}`;
export const GetManagementsDocument = `
    query getManagements($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getManagements(
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
        descriptionTranslations {
          ...HstoreLanguages
        }
        labelTranslations {
          ...HstoreLanguages
        }
        isNeonat
        isReferral
        levelOfUrgency
        isDefault
        hasInstances
        files {
          ...MediaFields
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}
${MediaFieldsFragmentDoc}`;
export const CreateManagementDocument = `
    mutation createManagement($projectId: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $isNeonat: Boolean, $isReferral: Boolean, $filesToAdd: [Upload!]) {
  createManagement(
    input: {params: {projectId: $projectId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency, isNeonat: $isNeonat, isReferral: $isReferral}, files: $filesToAdd}
  ) {
    management {
      id
    }
  }
}
    `;
export const UpdateManagementDocument = `
    mutation updateManagement($id: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $levelOfUrgency: Int, $isNeonat: Boolean, $isReferral: Boolean, $filesToAdd: [Upload!], $existingFilesToRemove: [Int!], $projectId: ID) {
  updateManagement(
    input: {params: {id: $id, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, levelOfUrgency: $levelOfUrgency, isNeonat: $isNeonat, isReferral: $isReferral, projectId: $projectId}, filesToAdd: $filesToAdd, existingFilesToRemove: $existingFilesToRemove}
  ) {
    management {
      id
    }
  }
}
    `;
export const DestroyManagementDocument = `
    mutation destroyManagement($id: ID!) {
  destroyManagement(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getManagement: build.query<GetManagementQuery, GetManagementQueryVariables>({
      query: (variables) => ({ document: GetManagementDocument, variables })
    }),
    getManagements: build.query<GetManagementsQuery, GetManagementsQueryVariables>({
      query: (variables) => ({ document: GetManagementsDocument, variables })
    }),
    createManagement: build.mutation<CreateManagementMutation, CreateManagementMutationVariables>({
      query: (variables) => ({ document: CreateManagementDocument, variables })
    }),
    updateManagement: build.mutation<UpdateManagementMutation, UpdateManagementMutationVariables>({
      query: (variables) => ({ document: UpdateManagementDocument, variables })
    }),
    destroyManagement: build.mutation<DestroyManagementMutation, DestroyManagementMutationVariables>({
      query: (variables) => ({ document: DestroyManagementDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


