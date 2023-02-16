/**
 * The external imports
 */
import type { QueryHookOptions } from '@reduxjs/toolkit/query'

/**
 * The internal imports
 */
import { Paginated } from './common'

export type Column = {
  accessorKey: string
  colSpan?: number
  // TODO : If sortable, implement this
  sortable?: boolean
}

export type Columns = {
  [key: string]: Column[]
}

export type TableState = {
  perPage?: number
  pageIndex?: number
  pageCount?: number
  lastPerPage?: number
  endCursor?: string
  startCursor?: string
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  search?: string
  totalCount?: number
}

type TableBaseProps = {
  source: string
  sortable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
}

export type TableStateProps = {
  tableState: TableState
  setTableState: React.Dispatch<React.SetStateAction<TableState>>
}

export type PaginationResult = {
  first: null | number
  last: null | number
}

export type RenderItemFn<T> = (el: T, search: string) => JSX.Element

type ApiQueryType<TData, TError, TQueryFnData = unknown> = () => {
  data: TData | undefined
  error: TError | undefined
  isLoading: boolean
} & (
  | { isError: false; isSuccess: true; refetch: () => void }
  | { isError: true; isSuccess: false }
) &
  QueryHookOptions<TQueryFnData>

export type DatatableProps = TableBaseProps & {
  apiQuery: ApiQueryType<Paginated<object>, Error, QueryFnData>
  requestParams?: object
  renderItem: RenderItemFn<T>
  perPage?: number
  paginable?: boolean
}

export type ToolbarProps = TableBaseProps & TableStateProps

export type MenuCellProps = {
  itemId: number
  onEdit?: (id: number) => void
  onDestroy?: (id: number) => void
  onDuplicate?: (id: number) => void
  onArchive?: (id: number) => void
  onLock?: (id: number) => void
  onUnlock?: (id: number) => void
  onInfo?: (id: number) => void
  showUrl?: string
}
