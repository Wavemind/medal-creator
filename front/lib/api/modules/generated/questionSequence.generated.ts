import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetQuestionsSequencesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetQuestionsSequencesQuery = { getQuestionsSequences: { __typename?: 'QuestionsSequenceConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'QuestionsSequenceEdge', node: { __typename?: 'QuestionsSequence', id: string, fullReference: string, hasInstances?: boolean | null, type: string, nodeComplaintCategories?: Array<{ __typename?: 'NodeComplaintCategory', complaintCategory: { __typename?: 'Variable', labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> } };


export const GetQuestionsSequencesDocument = `
    query getQuestionsSequences($projectId: ID!, $after: String, $before: String, $first: Int, $last: Int, $searchTerm: String) {
  getQuestionsSequences(
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
        hasInstances
        nodeComplaintCategories {
          complaintCategory {
            labelTranslations {
              ...HstoreLanguages
            }
          }
        }
        labelTranslations {
          ...HstoreLanguages
        }
        type
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getQuestionsSequences: build.query<GetQuestionsSequencesQuery, GetQuestionsSequencesQueryVariables>({
      query: (variables) => ({ document: GetQuestionsSequencesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


