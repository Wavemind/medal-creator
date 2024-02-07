import * as Types from '../../../../types/graphql.d';

import { HstoreLanguagesFragmentDoc, MediaFieldsFragmentDoc } from './fragments.generated';
import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetQuestionsSequenceQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetQuestionsSequenceQuery = { getQuestionsSequence: { id: string, type: Types.QuestionsSequenceCategoryEnum, cutOffStart?: number | null, cutOffEnd?: number | null, cutOffValueType?: string | null, minScore?: number | null, isDeployed: boolean, labelTranslations: { en?: string | null, fr?: string | null }, descriptionTranslations?: { en?: string | null, fr?: string | null } | null, nodeComplaintCategories?: Array<{ complaintCategory: { id: string, labelTranslations: { en?: string | null, fr?: string | null } } }> | null } };

export type GetQuestionsSequencesQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  searchTerm?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetQuestionsSequencesQuery = { getQuestionsSequences: { totalCount: number, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges: Array<{ node: { id: string, fullReference: string, hasInstances: boolean, isDeployed: boolean, type: Types.QuestionsSequenceCategoryEnum, nodeComplaintCategories?: Array<{ complaintCategory: { labelTranslations: { en?: string | null, fr?: string | null } } }> | null, labelTranslations: { en?: string | null, fr?: string | null } } }> } };

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


export type CreateQuestionsSequenceMutation = { createQuestionsSequence: { questionsSequence?: { id: string, fullReference: string, category: string, minScore?: number | null, labelTranslations: { en?: string | null, fr?: string | null }, diagramAnswers: Array<{ id: string, labelTranslations: { en?: string | null, fr?: string | null } }> } | null } };

export type UpdateQuestionsSequenceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  labelTranslations: Types.HstoreInput;
  descriptionTranslations: Types.HstoreInput;
  type: Types.QuestionsSequenceCategoryEnum;
  complaintCategoryIds?: Types.InputMaybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  cutOffStart?: Types.InputMaybe<Types.Scalars['Int']>;
  cutOffEnd?: Types.InputMaybe<Types.Scalars['Int']>;
  minScore?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type UpdateQuestionsSequenceMutation = { updateQuestionsSequence: { questionsSequence?: { id: string, fullReference: string, category: string, minScore?: number | null, labelTranslations: { en?: string | null, fr?: string | null }, diagramAnswers: Array<{ id: string, labelTranslations: { en?: string | null, fr?: string | null } }> } | null } };

export type DestroyQuestionsSequenceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DestroyQuestionsSequenceMutation = { destroyQuestionsSequence?: { id?: string | null } | null };


export const GetQuestionsSequenceDocument = `
    query getQuestionsSequence($id: ID!) {
  getQuestionsSequence(id: $id) {
    id
    labelTranslations {
      ...HstoreLanguages
    }
    descriptionTranslations {
      ...HstoreLanguages
    }
    type
    cutOffStart
    cutOffEnd
    cutOffValueType
    minScore
    isDeployed
    nodeComplaintCategories {
      complaintCategory {
        id
        labelTranslations {
          ...HstoreLanguages
        }
      }
    }
  }
}
    ${HstoreLanguagesFragmentDoc}`;
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
        isDeployed
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
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      category
      minScore
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
export const UpdateQuestionsSequenceDocument = `
    mutation updateQuestionsSequence($id: ID!, $labelTranslations: HstoreInput!, $descriptionTranslations: HstoreInput!, $type: QuestionsSequenceCategoryEnum!, $complaintCategoryIds: [ID!], $cutOffStart: Int, $cutOffEnd: Int, $minScore: Int) {
  updateQuestionsSequence(
    input: {params: {id: $id, labelTranslations: $labelTranslations, descriptionTranslations: $descriptionTranslations, type: $type, complaintCategoryIds: $complaintCategoryIds, cutOffStart: $cutOffStart, cutOffEnd: $cutOffEnd, minScore: $minScore}}
  ) {
    questionsSequence {
      id
      fullReference
      labelTranslations {
        ...HstoreLanguages
      }
      category
      minScore
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
export const DestroyQuestionsSequenceDocument = `
    mutation destroyQuestionsSequence($id: ID!) {
  destroyQuestionsSequence(input: {id: $id}) {
    id
  }
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getQuestionsSequence: build.query<GetQuestionsSequenceQuery, GetQuestionsSequenceQueryVariables>({
      query: (variables) => ({ document: GetQuestionsSequenceDocument, variables })
    }),
    getQuestionsSequences: build.query<GetQuestionsSequencesQuery, GetQuestionsSequencesQueryVariables>({
      query: (variables) => ({ document: GetQuestionsSequencesDocument, variables })
    }),
    createQuestionsSequence: build.mutation<CreateQuestionsSequenceMutation, CreateQuestionsSequenceMutationVariables>({
      query: (variables) => ({ document: CreateQuestionsSequenceDocument, variables })
    }),
    updateQuestionsSequence: build.mutation<UpdateQuestionsSequenceMutation, UpdateQuestionsSequenceMutationVariables>({
      query: (variables) => ({ document: UpdateQuestionsSequenceDocument, variables })
    }),
    destroyQuestionsSequence: build.mutation<DestroyQuestionsSequenceMutation, DestroyQuestionsSequenceMutationVariables>({
      query: (variables) => ({ document: DestroyQuestionsSequenceDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


