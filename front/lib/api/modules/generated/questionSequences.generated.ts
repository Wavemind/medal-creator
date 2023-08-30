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


export type GetQuestionsSequencesQuery = { getQuestionsSequences: { __typename?: 'QuestionsSequenceConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ __typename?: 'QuestionsSequenceEdge', node: { __typename?: 'QuestionsSequence', id: string, fullReference: string, hasInstances?: boolean | null, type: Types.QuestionsSequenceCategoryEnum, nodeComplaintCategories?: Array<{ __typename?: 'NodeComplaintCategory', complaintCategory: { __typename?: 'Variable', labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> | null, labelTranslations: { __typename?: 'Hstore', en?: string | null, fr?: string | null } } }> } };

export type CreateQuestionsSequenceMutationVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  type: Types.QuestionsSequenceCategoryEnum;
  complaintCategoryIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  minScore?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type CreateQuestionsSequenceMutation = { createQuestionsSequence?: { __typename?: 'CreateQuestionsSequencePayload', questionsSequence?: { __typename?: 'QuestionsSequence', id: string } | null } | null };


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
export const CreateQuestionsSequenceDocument = `
    mutation createQuestionsSequence($projectId: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $type: QuestionsSequenceCategoryEnum!, $complaintCategoryIds: [ID!], $cutOffStart: Int, $cutOffEnd: Int, $minScore: Int) {
  createQuestionsSequence(
    input: {params: {projectId: $projectId, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, type: $type, complaintCategoryIds: $complaintCategoryIds, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, minScore: $minScore}}
  ) {
    questionsSequence {
      id
    }
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getQuestionsSequences: build.query<GetQuestionsSequencesQuery, GetQuestionsSequencesQueryVariables>({
      query: (variables) => ({ document: GetQuestionsSequencesDocument, variables })
    }),
    createQuestionsSequence: build.mutation<CreateQuestionsSequenceMutation, CreateQuestionsSequenceMutationVariables>({
      query: (variables) => ({ document: CreateQuestionsSequenceDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


