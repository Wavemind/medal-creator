/**
 * The external imports
 */
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { HYDRATE } from 'next-redux-wrapper'
import { signOut } from 'next-auth/react'

/**
 * The internal imports
 */
import { isErrorWithMessage, prepareHeaders } from '@/lib/utils'

export const apiGraphql = createApi({
  reducerPath: 'apiGraphql',
  baseQuery: graphqlRequestBaseQuery({
    url: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    prepareHeaders: prepareHeaders,
    customErrors: props => {
      // Just in case token is removed from DB
      if (props.response.status === 401) {
        signOut({
          callbackUrl: '/auth/sign-in?notifications=session-expired',
        })
      } else {
        if (
          props.response.errors &&
          !isErrorWithMessage(props.response.errors)
        ) {
          return {
            message: JSON.parse(props.response.errors[0].message),
          }
        }
        return props
      }
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
