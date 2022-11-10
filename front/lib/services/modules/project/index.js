/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getProjectQuery from './getProject'
import editProjectQuery from './editProject'
import getProjectsQuery from './getProjects'
import createProjectMutation from './createProject'

export const projectApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getProject: getProjectQuery(build),
    editProject: editProjectQuery(build),
    getProjects: getProjectsQuery(build),
    createProject: createProjectMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetProjectQuery,
  useEditProjectQuery,
  useGetProjectsQuery,
  useCreateProjectMutation,
} = projectApi

// Export endpoints for use in SSR
export const { getProject, getProjects, editProject } = projectApi.endpoints
