/**
 * The external imports
 */
import type { MultiValue, SingleValue } from 'chakra-react-select'
import type { ChangeEvent, SetStateAction, Dispatch } from 'react'

/**
 * The internal imports
 */
import type { Option } from '@/types'

export type FilterKey = 'selectedCategories' | 'selectedIsNeonat' | 'searchTerm'

export type UpdateFilterData<Key extends FilterKey> =
  Key extends 'selectedCategories'
    ? MultiValue<Option>
    : Key extends 'selectedIsNeonat'
    ? SingleValue<Option>
    : Key extends 'searchTerm'
    ? string
    : string

export type FilterState = {
  searchTerm: string
  selectedIsNeonat: SingleValue<Option>
  selectedCategories: MultiValue<Option>
}

type PaginationFilterContextType<DataType> = {
  filterState: FilterState
  updateFilter: <KeyToUpdate extends FilterKey>(
    key: KeyToUpdate,
    data: UpdateFilterData<KeyToUpdate>
  ) => void
  resetFilter: () => void
  updateSearch: (e: ChangeEvent<HTMLInputElement>) => void
  resetSearch: () => void
  data: DataType[]
  setData: Dispatch<SetStateAction<DataType[]>>
  after: string
  setAfter: Dispatch<SetStateAction<string>>
}

interface PaginationFilterProviderProps<DataType> {
  children: React.ReactNode
}
