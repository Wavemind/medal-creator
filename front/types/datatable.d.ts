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
import { Drug } from './drug'

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
  first: number | null | undefined
  last: number | null | undefined
}

export type RenderItemFn<Model> = (el: Model, search: string) => JSX.Element

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

export type DrugRowComponent = FC<
  IsAdminOrClinician & {
    row: Drug
    language: string
    searchTerm: string
  }
>

export type MenuCellComponent = FC<{
  itemId: number
  onEdit?: (id: number) => void
  onDestroy?: (id: number) => void
  canEdit?: boolean
  canDestroy?: boolean
  canDuplicate?: boolean
  onDuplicate?: (id: number) => void
  onArchive?: (id: number) => void
  onLock?: (id: number) => void
  onUnlock?: (id: number) => void
  onInfo?: (id: number) => void
  onNew?: (id: number) => void
  showUrl?: string
}>

export type PaginationComponent = FC<TableStateProps>

export type ToolbarComponent = FC<TableBaseProps & TableStateProps>
