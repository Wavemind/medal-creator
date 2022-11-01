/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getProjectQuery from './getProject'
import getProjectsQuery from './getProjects'

export const projectApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getProject: getProjectQuery(build),
    getProjects: getProjectsQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetProjectQuery,
  useGetProjectsQuery,
  util: { getRunningOperationPromises },
} = projectApi

// Export endpoints for use in SSR
export const { getProject, getProjects } = projectApi.endpoints
