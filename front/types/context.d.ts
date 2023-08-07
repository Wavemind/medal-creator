/**
 * The external imports
 */
import type { MultiValue, SingleValue } from 'chakra-react-select'
import type { ChangeEvent, SetStateAction, Dispatch } from 'react'

/**
 * The internal imports
 */
import type { Option } from '@/types'

export type FilterKey = 'categories' | 'isNeonat' | 'searchTerm'

export type UpdateFilterData<K extends FilterKey> = K extends 'categories'
  ? MultiValue<Option>
  : K extends 'isNeonat'
  ? SingleValue<Option> | null
  : string

export type FilterState = {
  searchTerm: string
  isNeonat: boolean | null
  categories: MultiValue<Option>
}

type PaginationFilterContextType<DataType> = {
  filterState: FilterState
  updateFilter: <KeyToUpdate extends FilterKey>(
    key: KeyToUpdate,
    data: unknown
  ) => void
  resetFilter: () => void
  updateSearch: (e: ChangeEvent<HTMLInputElement>) => void
  resetSearch: () => void
  data: DataType[]
  setData: Dispatch<SetStateAction<DataType[]>>
  after: string
  setAfter: Dispatch<SetStateAction<string>>
}
