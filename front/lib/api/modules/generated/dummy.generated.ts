import * as Types from '../../../../types/graphql.d';

import { apiGraphql } from '@/lib/api/apiGraphql';
export type GetDummyQueryVariables = Types.Exact<{
  algorithmDummyField: Types.AlgorithmAvailableCategoriesEnum;
  decisionTreeDummyField: Types.DecisionTreeAvailableCategoriesEnum;
  diagnosisDummyField: Types.DiagnosisAvailableCategoriesEnum;
  questionsSequenceDummyField: Types.QuestionsSequenceAvailableCategoriesEnum;
  questionsSequenceScoredDummyField: Types.QuestionsSequenceScoredAvailableCategoriesEnum;
}>;


export type GetDummyQuery = { getDummy?: string | null };


export const GetDummyDocument = `
    query getDummy($algorithmDummyField: AlgorithmAvailableCategoriesEnum!, $decisionTreeDummyField: DecisionTreeAvailableCategoriesEnum!, $diagnosisDummyField: DiagnosisAvailableCategoriesEnum!, $questionsSequenceDummyField: QuestionsSequenceAvailableCategoriesEnum!, $questionsSequenceScoredDummyField: QuestionsSequenceScoredAvailableCategoriesEnum!) {
  getDummy(
    algorithmDummyField: $algorithmDummyField
    decisionTreeDummyField: $decisionTreeDummyField
    diagnosisDummyField: $diagnosisDummyField
    questionsSequenceDummyField: $questionsSequenceDummyField
    questionsSequenceScoredDummyField: $questionsSequenceScoredDummyField
  )
}
    `;

const injectedRtkApi = apiGraphql.injectEndpoints({
  endpoints: (build) => ({
    getDummy: build.query<GetDummyQuery, GetDummyQueryVariables>({
      query: (variables) => ({ document: GetDummyDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


