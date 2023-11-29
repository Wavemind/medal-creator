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
  GetDrugQuery,
  EditDrugQuery,
  api as generatedDrugApi,
  UpdateDrugMutation,
  CreateDrugMutation,
} from '../generated/drug.generated'

type Definitions = DefinitionsFromApi<typeof generatedDrugApi>

type GetDrugs = GetDrugsQuery['getDrugs']
export type GetDrug = GetDrugQuery['getDrug']
export type EditDrug = EditDrugQuery['getDrug']
type CreateDrug = CreateDrugMutation['createDrug']['drug']
type UpdateDrug = UpdateDrugMutation['updateDrug']['drug']

type UpdatedDefinitions = {
  getDrugs: OverrideResultType<Definitions['getDrugs'], GetDrugs>
  getDrug: OverrideResultType<Definitions['getDrug'], GetDrug>
  editDrug: OverrideResultType<Definitions['editDrug'], EditDrug>
  createDrug: OverrideResultType<Definitions['createDrug'], CreateDrug>
  updateDrug: OverrideResultType<Definitions['updateDrug'], UpdateDrug>
}

const drugApi = generatedDrugApi.enhanceEndpoints<'Drug', UpdatedDefinitions>({
  endpoints: {
    getDrugs: {
      providesTags: ['Drug'],
      transformResponse: (response: GetDrugsQuery): GetDrugs =>
        response.getDrugs,
    },
    getDrug: {
      providesTags: ['Drug'],
      transformResponse: (response: GetDrugQuery): GetDrug => response.getDrug,
    },
    editDrug: {
      providesTags: ['Drug'],
      transformResponse: (response: EditDrugQuery): EditDrug =>
        response.getDrug,
    },
    createDrug: {
      invalidatesTags: ['Drug'],
      transformResponse: (response: CreateDrugMutation): CreateDrug =>
        response.createDrug.drug,
    },
    updateDrug: {
      invalidatesTags: ['Drug'],
      transformResponse: (response: UpdateDrugMutation): UpdateDrug =>
        response.updateDrug.drug,
    },
    destroyDrug: {
      invalidatesTags: ['Drug'],
    },
  },
})

// Export hooks for usage in functional components
export const {
  useLazyGetDrugQuery,
  useGetDrugQuery,
  useEditDrugQuery,
  useLazyGetDrugsQuery,
  useCreateDrugMutation,
  useUpdateDrugMutation,
  useDestroyDrugMutation,
} = drugApi
