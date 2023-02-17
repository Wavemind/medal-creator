/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
// import getProjectQuery from './project/getProject'
// import getProjectSummaryQuery from './project/getProjectSummary'
// import editProjectQuery from './project/editProject'
// import getProjectsQuery from './project/getProjects'
// import createProjectMutation from './project/createProject'
// import updateProjectMutation from './project/updateProject'
import unsubscribeFromProjectMutation from './project/unsubscribeFromProject'
import getLastUpdatedDecisionTreesQuery from './project/getLastUpdatedDecisionTrees'
import {
  createProjectDocument,
  editProjectDocument,
  getProjectDocument,
  getProjectsDocument,
  getProjectSummaryDocument,
  updateProjectDocument,
} from './documents/project'
import type { Project, ProjectSummary } from '@/types/project'
import type { Paginated } from '@/types/common'

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
    getProject: build.query<Project, string>({
      query: id => ({
        document: getProjectDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: Project }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    getProjectSummary: build.query<ProjectSummary, string>({
      query: id => ({
        document: getProjectSummaryDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: ProjectSummary }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    getLastUpdatedDecisionTrees: getLastUpdatedDecisionTreesQuery(build),
    editProject: build.query<Project, string>({
      query: id => ({
        document: editProjectDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: Project }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    createProject: build.mutation({
      query: values => ({
        document: createProjectDocument,
        variables: values,
      }),
      transformResponse: (response: { createProject: { project: Project } }) =>
        response.createProject.project,
      invalidatesTags: ['Project'],
    }),
    updateProject: build.mutation({
      query: values => ({
        document: updateProjectDocument,
        variables: values,
      }),
      transformResponse: (response: { updateProject: { project: Project } }) =>
        response.updateProject.project,
      invalidatesTags: ['Project'],
    }),
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
