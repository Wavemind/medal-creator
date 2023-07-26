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
  GetDrugsQuery,
  EditDrugQuery,
  api as generatedDrugApi,
} from '../generated/drug.generated'

type Definitions = DefinitionsFromApi<typeof generatedDrugApi>

type GetDrugs = GetDrugsQuery['getDrugs']
export type EditDrug = EditDrugQuery['getDrug']

type UpdatedDefinitions = {
  getDrugs: OverrideResultType<Definitions['getDrugs'], GetDrugs>
  editDrug: OverrideResultType<Definitions['editDrug'], EditDrug>
}

const drugApi = generatedDrugApi.enhanceEndpoints<'Drug', UpdatedDefinitions>({
  endpoints: {
    getDrugs: {
      providesTags: ['Drug'],
      transformResponse: (response: GetDrugsQuery): GetDrugs =>
        response.getDrugs,
    },
    editDrug: {
      providesTags: ['Drug'],
      transformResponse: (response: EditDrugQuery): EditDrug =>
        response.getDrug,
    },
    createDrug: {
      invalidatesTags: ['Drug'],
    },
    updateDrug: {
      invalidatesTags: ['Drug'],
    },
    destroyDrug: {
      invalidatesTags: ['Drug'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useEditDrugQuery,
  useLazyGetDrugsQuery,
  useCreateDrugMutation,
  useUpdateDrugMutation,
  useDestroyDrugMutation,
} = drugApi
