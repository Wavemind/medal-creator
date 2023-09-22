/**
 * The external imports
 */
import { useState } from 'react'
import type { ChangeEvent } from 'react'

/**
 * The internal imports
 */
import { PaginationFilterContext } from '@/lib/contexts'
import type {
  FilterKey,
  FilterState,
  UpdateFilterData,
  PaginationFilterProviderProps,
} from '@/types'

const PaginationFilterProvider = <DataType extends object>({
  children,
}: PaginationFilterProviderProps<DataType>) => {
  const [after, setAfter] = useState('')
  const [pageNum, setPageNum] = useState(1)
  const [data, setData] = useState<DataType[]>([])
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    selectedIsNeonat: null,
    selectedCategories: [],
  })

  const updateFilter = <KeyToUpdate extends FilterKey>(
    key: FilterKey,
    data: UpdateFilterData<KeyToUpdate>
  ): void => {
    resetPagination()
    setFilterState(prevState => ({
      ...prevState,
      [key]: data,
    }))
  }

  const updateSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    resetPagination()
    setFilterState(prevState => ({
      ...prevState,
      searchTerm: e.target.value,
    }))
  }

  const resetSearch = (): void => {
    resetPagination()
    setFilterState(prevState => ({
      ...prevState,
      searchTerm: '',
    }))
  }

  const resetFilter = (): void => {
    resetPagination()
    setFilterState(prevState => ({
      ...prevState,
      selectedIsNeonat: null,
      selectedCategories: [],
    }))
  }

  const resetPagination = (): void => {
    setData([])
    setAfter('')
    setPageNum(1)
  }

  return (
    <PaginationFilterContext.Provider
      value={{
        after,
        setAfter,
        data,
        setData,
        pageNum,
        setPageNum,
        filterState,
        updateFilter,
        updateSearch,
        resetSearch,
        resetFilter,
      }}
    >
      {children}
    </PaginationFilterContext.Provider>
  )
}

export default PaginationFilterProvider
