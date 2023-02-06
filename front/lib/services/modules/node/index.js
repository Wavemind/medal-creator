/**
 * The internal imports
 */
import { apiGraphql } from '../../apiGraphql'
import getComplaintCategoriesQuery from './getComplaintCategories'

export const nodesApi = apiGraphql.injectEndpoints({
  endpoints: build => ({
    getComplaintCategories: getComplaintCategoriesQuery(build),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const { useGetComplaintCategoriesQuery } = nodesApi
