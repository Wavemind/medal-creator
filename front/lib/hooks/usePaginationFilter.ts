/**
 * The external imports
 */
import { useContext } from 'react'

/**
 * The internal imports
 */
import { PaginationFilterContext } from '@/lib/contexts'
import type { PaginationFilterContextType } from '@/types'

export const usePaginationFilter = <DataType>() => {
  const context = useContext(
    PaginationFilterContext
  ) as PaginationFilterContextType<DataType>

  if (!context) {
    throw new Error(
      'usePaginationFilter must be used within PaginationFilterContext'
    )
  }
  return context
}
