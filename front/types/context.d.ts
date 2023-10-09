/**
 * The external imports
 */
import type { MultiValue, SingleValue } from 'chakra-react-select'
import type { ChangeEvent, SetStateAction, Dispatch, RefObject } from 'react'

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
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

export type AutocompleteProps = Array<{ label: string; value: string }>

export type FormulaContextType = {
  inputRef: RefObject<HTMLInputElement>
  inputValue: string
  autocompleteOptions: AutocompleteProps
  setAutocompleteOptions: Dispatch<SetStateAction<AutocompleteProps>>
  setInputValue: Dispatch<SetStateAction<string>>
  handleMenuItemClick: Dispatch<string>
}

export type ProjectContextType = {
  name: string
  projectLanguage: string
  isAdminOrClinician: boolean
}

export type PaginationFilterProviderProps = {
  children: React.ReactNode
}

export type DefaultProviderProps = {
  children: React.ReactNode
}
