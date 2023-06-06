import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetComplaintCategoriesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetComplaintCategoriesQuery = { getComplaintCategories: { __typename?: 'NodeConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'NodeEdge', node: { __typename?: 'Node', id: string, labelTranslations: { __typename?: 'Hstore', en: string, fr: string } } }> } };


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
          en
          fr
        }
      }
    }
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getComplaintCategories: build.query<GetComplaintCategoriesQuery, GetComplaintCategoriesQueryVariables>({
      query: (variables) => ({ document: GetComplaintCategoriesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


