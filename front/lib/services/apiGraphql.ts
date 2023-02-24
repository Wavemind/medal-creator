/**
 * The external imports
 */
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { HYDRATE } from 'next-redux-wrapper'

/**
 * The internal imports
 */
import prepareHeaders from '@/lib/utils/prepareHeaders'

export const apiGraphql = createApi({
  reducerPath: 'apiGraphql',
  baseQuery: graphqlRequestBaseQuery({
    url: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    prepareHeaders: prepareHeaders,
  }),
  refetchOnMountOrArgChange: 10,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: () => ({}),
  tagTypes: [
    'User',
    'Project',
    'Algorithm',
    'DecisionTree',
    'Diagnosis',
    'Node',
    'Language',
  ],
})
