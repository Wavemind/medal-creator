import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetComplaintCategoriesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetComplaintCategoriesQuery = { getComplaintCategories: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, labelTranslations: { en?: string | null, fr?: string | null } } }> } };


export const GetComplaintCategoriesDocument = `
    query getComplaintCategories($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  getComplaintCategories(
    projectId: $projectId
    after: $after
    before: $before
    first: $first
    last: $last
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
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getComplaintCategories: build.query<GetComplaintCategoriesQuery, GetComplaintCategoriesQueryVariables>({
      query: (variables) => ({ document: GetComplaintCategoriesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


