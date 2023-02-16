/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import getProjectQuery from './project/getProject'
import getProjectSummaryQuery from './project/getProjectSummary'
import editProjectQuery from './project/editProject'
// import getProjectsQuery from './project/getProjects'
import createProjectMutation from './project/createProject'
import updateProjectMutation from './project/updateProject'
import unsubscribeFromProjectMutation from './project/unsubscribeFromProject'
import getLastUpdatedDecisionTreesQuery from './project/getLastUpdatedDecisionTrees'
import { getProjectsDocument } from './documents/project'
import { Project } from '@/types/project'
import { Paginated } from '@/types/common'

export const projectApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getProjects: build.query<Paginated<Project>, { search?: string }>({
      query: ({ search }) => ({
        document: getProjectsDocument,
        variables: { searchTerm: search },
      }),
      transformResponse: (response: { getProjects: Paginated<Project> }) =>
        response.getProjects,
      providesTags: ['Project'],
    }),
    getProject: getProjectQuery(build),
    getProjectSummary: getProjectSummaryQuery(build),
    getLastUpdatedDecisionTrees: getLastUpdatedDecisionTreesQuery(build),
    editProject: editProjectQuery(build),
    createProject: createProjectMutation(build),
    updateProject: updateProjectMutation(build),
    unsubscribeFromProject: unsubscribeFromProjectMutation(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useGetProjectQuery,
  useGetProjectSummaryQuery,
  useLazyGetLastUpdatedDecisionTreesQuery,
  useEditProjectQuery,
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUnsubscribeFromProjectMutation,
} = projectApi

// Export endpoints for use in SSR
export const { getProject, getProjectSummary, getProjects, editProject } =
  projectApi.endpoints
