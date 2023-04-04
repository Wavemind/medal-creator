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
import { calculatePagination } from '@/lib/utils'
import type {
  Project,
  ProjectSummary,
  ProjectInputs,
  Paginated,
  PaginatedQueryWithProject,
  DecisionTree,
} from '@/types'

export const projectApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getProject: build.query<Project, number>({
      query: id => ({
        document: getProjectDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: Project }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    getProjects: build.query<Paginated<Project>, { search: string } | void>({
      query: values => ({
        document: getProjectsDocument,
        variables: { searchTerm: values?.search },
      }),
      transformResponse: (response: { getProjects: Paginated<Project> }) =>
        response.getProjects,
      providesTags: ['Project'],
    }),
    getProjectSummary: build.query<ProjectSummary, number>({
      query: id => ({
        document: getProjectSummaryDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: ProjectSummary }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    getLastUpdatedDecisionTrees: build.query<
      Paginated<DecisionTree>,
      PaginatedQueryWithProject
    >({
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
    editProject: build.query<Project, number>({
      query: id => ({
        document: editProjectDocument,
        variables: { id },
      }),
      transformResponse: (response: { getProject: Project }) =>
        response.getProject,
      providesTags: ['Project'],
    }),
    createProject: build.mutation<Project, ProjectInputs>({
      query: values => ({
        document: createProjectDocument,
        variables: values,
      }),
      transformResponse: (response: { createProject: { project: Project } }) =>
        response.createProject.project,
      invalidatesTags: ['Project'],
    }),
    updateProject: build.mutation<
      Project,
      Partial<ProjectInputs> & Pick<Project, 'id'>
    >({
      query: values => ({
        document: updateProjectDocument,
        variables: values,
      }),
      transformResponse: (response: { updateProject: { project: Project } }) =>
        response.updateProject.project,
      invalidatesTags: ['Project'],
    }),
    unsubscribeFromProject: build.mutation<Project, number>({
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
