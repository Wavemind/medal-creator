/**
 * The external imports
 */
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { HYDRATE } from 'next-redux-wrapper'

/**
 * The internal imports
 */
import { prepareHeaders } from '@/lib/utils'

export const apiGraphql = createApi({
  reducerPath: 'apiGraphql',
  baseQuery: graphqlRequestBaseQuery({
    url: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    prepareHeaders: prepareHeaders,
    customErrors: props => {
      console.log(props.response)
      if (props.response.errors) {
        return {
          message: JSON.parse(props.response.errors[0].message),
        }
      }
      return props
    },
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
    'TwoFactor',
  ],
})
