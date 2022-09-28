/**
 * The external imports
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { getCookie } from 'cookies-next'

/**
 * Default api configuration
 */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers, { getState }) => {
    const unparsedSession = getCookie('session')
    let session = ''
    if (unparsedSession) {
      session = JSON.parse(unparsedSession)
    } else if (getState().session) {
      session = getState().session
    } else {
      return headers
    }

    headers.set('access-token', session.accessToken)
    headers.set('client', session.client)
    headers.set('expiry', session.expiry)
    headers.set('uid', session.uid)

    return headers
  },
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
  tagTypes: ['Credential'],
})
