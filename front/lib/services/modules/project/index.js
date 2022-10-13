/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getProjectQuery from './getProject'

export const projectApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getProject: getProjectQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetProjectQuery,
  util: { getRunningOperationPromises },
} = projectApi

// Export endpoints for use in SSR
export const { getProject } = projectApi.endpoints
