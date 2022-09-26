/**
 * The external imports
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

/**
 * Default api configuration
 */
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
})

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    console.log('ERROR API.JS', result, args)
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: () => ({}),
})
