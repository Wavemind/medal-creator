/**
 * The external imports
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

/**
 * The internal imports
 */
import { prepareHeaders } from '../utils/prepareHeaders'

/**
 * Default api configuration
 */
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  prepareHeaders: prepareHeaders,
})

export const apiRest = createApi({
  reducerPath: 'apiRest',
  baseQuery: baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: () => ({}),
  tagTypes: ['Session'],
})
