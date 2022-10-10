/**
 * The external imports
 */
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient } from 'graphql-request'

/**
 * The internal imports
 */
import prepareHeaders from '../utils/prepareHeaders'

const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  {
    headers: {
      Accept: 'application/json',
    },
  }
)

export const apiGraphql = createApi({
  reducerPath: 'apiGraphql',
  baseQuery: graphqlRequestBaseQuery({
    client,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: () => ({}),
  tagTypes: ['User'],
})
