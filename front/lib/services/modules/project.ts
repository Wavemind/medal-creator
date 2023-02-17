/**
 * The internal imports
 */
import { apiGraphql } from '../apiGraphql'
import {
  createProjectDocument,
  editProjectDocument,
  getLastUpdatedDecisionTreesDocument,
  getProjectDocument,
  getProjectsDocument,
  getProjectSummaryDocument,
  unsubscribeFromProjectDocument,
  updateProjectDocument,
} from './documents/project'
import calculatePagination from '@/lib/utils/calculatePagination'
import type { Project, ProjectSummary } from '@/types/project'
import type { Paginated } from '@/types/common'
import type { DecisionTree } from '@/types/decisionTree'

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
    getLastUpdatedDecisionTrees: build.query({
      query: tableState => {
        const { projectId, endCursor, startCursor } = tableState
        return {
          document: getLastUpdatedDecisionTreesDocument,
          variables: {
            projectId,
            after: endCursor,
            before: startCursor,
            ...calculatePagination(tableState),
          },
        }
      },
      transformResponse: (response: {
        getLastUpdatedDecisionTrees: Paginated<DecisionTree>
      }) => response.getLastUpdatedDecisionTrees,
      providesTags: ['Project'],
    }),
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
    unsubscribeFromProject: build.mutation<Project, string>({
      query: id => ({
        document: unsubscribeFromProjectDocument,
        variables: { id },
      }),
      transformResponse: (response: {
        unsubscribeFromProject: { project: Project }
      }) => response.unsubscribeFromProject.project,
      invalidatesTags: ['Project'],
    }),
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
