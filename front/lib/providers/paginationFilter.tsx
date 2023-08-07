/**
 * The external imports
 */
import { useState } from 'react'
import type { ChangeEvent, FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import { PaginationFilterContext } from '@/lib/contexts'
import type { FilterKey, FilterState, UpdateFilterData } from '@/types'

const PaginationFilterProvider: FC<PropsWithChildren> = ({ children }) => {
  const [after, setAfter] = useState('')
  const [data, setData] = useState([])
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    isNeonat: null,
    categories: [],
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
      isNeonat: null,
      categories: [],
    }))
  }

  const resetPagination = (): void => {
    setData([])
    setAfter('')
  }

  return (
    <PaginationFilterContext.Provider
      value={{
        after,
        setAfter,
        data,
        setData,
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
