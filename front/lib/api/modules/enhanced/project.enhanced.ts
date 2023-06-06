/**
 * The internal imports
 */
import {
  DefinitionsFromApi,
  OverrideResultType,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions'

/**
 * The internal imports
 */
import {
  GetProjectsQuery,
  GetProjectQuery,
  api as generatedProjectApi,
  GetProjectSummaryQuery,
  GetLastUpdatedDecisionTreesQuery,
  EditProjectQuery,
  CreateProjectMutation,
} from '../generated/project.generated'

type Definitions = DefinitionsFromApi<typeof generatedProjectApi>

export type GetProjects = GetProjectsQuery['getProjects']
type GetProject = GetProjectQuery['getProject']
type GetProjectSummary = GetProjectSummaryQuery['getProject']
type GetLastUpdatedDecisionTrees =
  GetLastUpdatedDecisionTreesQuery['getLastUpdatedDecisionTrees']
type EditProject = EditProjectQuery['getProject']
type CreateProject = CreateProjectMutation['createProject']['project']

type UpdatedDefinitions = Omit<Definitions, 'getProjects' | 'getProject'> & {
  getProjects: OverrideResultType<Definitions['getProjects'], GetProjects>
  getProject: OverrideResultType<Definitions['getProject'], GetProject>
  getProjectSummary: OverrideResultType<
    Definitions['getProjectSummary'],
    GetProjectSummary
  >
  getLastUpdatedDecisionTrees: OverrideResultType<
    Definitions['getLastUpdatedDecisionTrees'],
    GetLastUpdatedDecisionTrees
  >
  editProject: OverrideResultType<Definitions['editProject'], EditProject>
  createProject: OverrideResultType<Definitions['createProject'], CreateProject>
}

const projectApi = generatedProjectApi.enhanceEndpoints<
  'Project',
  UpdatedDefinitions
>({
  endpoints: {
    getProject: {
      providesTags: ['Project'],
      transformResponse: (response: GetProjectQuery): GetProject =>
        response.getProject,
    },
    getProjects: {
      providesTags: ['Project'],
      transformResponse: (response: GetProjectsQuery): GetProjects =>
        response.getProjects,
    },
    getProjectSummary: {
      providesTags: ['Project'],
      transformResponse: (
        response: GetProjectSummaryQuery
      ): GetProjectSummary => response.getProject,
    },
    getLastUpdatedDecisionTrees: {
      providesTags: ['Project'],
      transformResponse: (
        response: GetLastUpdatedDecisionTreesQuery
      ): GetLastUpdatedDecisionTrees => response.getLastUpdatedDecisionTrees,
    },
    editProject: {
      providesTags: ['Project'],
      transformResponse: (response: EditProjectQuery): EditProject =>
        response.getProject,
    },
    createProject: {
      invalidatesTags: ['Project'],
      transformResponse: (response: CreateProjectMutation): CreateProject =>
        response.createProject?.project,
    },
    updateProject: {
      invalidatesTags: ['Project'],
    },
    unsubscribeFromProject: {
      invalidatesTags: ['Project'],
    },
  },
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
