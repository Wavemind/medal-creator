/**
 * The external imports
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { HYDRATE } from 'next-redux-wrapper'
import { deleteCookie } from 'cookies-next'

/**
 * The internal imports
 */
import prepareHeaders from '@/lib/utils/prepareHeaders'

/**
 * Default api configuration
 */
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  prepareHeaders: prepareHeaders,
})

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    deleteCookie('session')
    console.log('ERROR API.JS', result, args)
  }

  return result
}

export const apiRest = createApi({
  reducerPath: 'apiRest',
  baseQuery: baseQueryWithInterceptor,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: () => ({}),
  tagTypes: ['Session'],
})
