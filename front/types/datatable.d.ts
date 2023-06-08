/**
 * The external imports
 */
import type { FC } from 'react'
import type { QueryHookOptions } from '@reduxjs/toolkit/query'

/**
 * The internal imports
 */
import type { Paginated, IsAdminOrClinician } from './common'
import type { DecisionTree } from './decisionTree'
import type { Scalars } from './graphql'

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
  perPage: number
  pageIndex: number
  pageCount: number
  lastPerPage: number
  endCursor: string
  startCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  search: string
  totalCount: number
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
  first: number | null
  last: number | null
}

export type RenderItemFn<Model> = (el: Model, search: string) => JSX.Element | undefined

type ApiQueryType<TData, TError, TQueryFnData = unknown> = () => {
  data: TData | undefined
  error: TError | undefined
  isLoading: boolean
} & (
  | { isError: false; isSuccess: true; refetch: () => void }
  | { isError: true; isSuccess: false }
) &
  QueryHookOptions<TQueryFnData>

export type DatatableComponent = FC<
  TableBaseProps & {
    apiQuery: ApiQueryType<Paginated<object>, Error, QueryFnData>
    requestParams?: object
    renderItem: RenderItemFn<Model>
    perPage?: number
    paginable?: boolean
  }
>

export type DecisionTreeRowComponent = FC<
  IsAdminOrClinician & {
    row: DecisionTree
    language: string
    searchTerm: string
  }
>

export type MenuCellComponent = FC<{
  itemId: Scalars['ID']
  onEdit?: (id: Scalars['ID']) => void
  canDestroy?: boolean
  onDestroy?: (id: Scalars['ID']) => void
  onDuplicate?: (id: Scalars['ID']) => void
  onArchive?: (id: Scalars['ID']) => void
  onLock?: (id: Scalars['ID']) => void
  onUnlock?: (id: Scalars['ID']) => void
  onInfo?: (id: Scalars['ID']) => void
  onNew?: (id: Scalars['ID']) => void
  showUrl?: string
}>

export type PaginationComponent = FC<TableStateProps>

export type ToolbarComponent = FC<TableBaseProps & TableStateProps>
