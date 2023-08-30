/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'
import type {
  MutationDefinition,
  QueryHookOptions,
} from '@reduxjs/toolkit/query'

/**
 * The internal imports
 */
import type { Paginated, IsAdminOrClinician, ProjectId } from './common'
import type { DecisionTree } from './decisionTree'
import type { Scalars } from './graphql'
import type { Drug } from './drug'
import type { Management } from './management'
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import {
  DestroyManagementMutation,
  DestroyManagementMutationVariables,
} from '@/lib/api/modules/generated/management.generated'
import {
  DestroyDrugMutation,
  DestroyDrugMutationVariables,
} from '@/lib/api/modules/generated/drug.generated'
import { TABLE_COLUMNS } from '@/lib/config/constants'

export type Column = {
  accessorKey: string
  colSpan?: number
  // TODO : If sortable, implement this
  sortable?: boolean
}

export type TableList =
  | 'lastActivities'
  | 'algorithms'
  | 'decisionTrees'
  | 'users'
  | 'variables'
  | 'drugs'
  | 'managements'
  | 'medicalConditions'

export type TableColumns = {
  [key in TableList]: Column[]
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
  source: TableList
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

export type RenderItemFn<Model> = (
  el: Model,
  search: string
) => JSX.Element | undefined

type ApiQueryType<TData, TError, TQueryFnData = unknown> = () => {
  data: TData | undefined
  error: TError | undefined
  isLoading: boolean
} & (
  | { isError: false; isSuccess: true; refetch: () => void }
  | { isError: true; isSuccess: false }
) &
  QueryHookOptions<TQueryFnData>

// TODO : Correct this type cos it's not working
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
  IsAdminOrClinician &
    ProjectId & {
      row: Drug
      language: string
      searchTerm: string
    }
>

// TODO : Try to fix the any for the nodeQuery type
export type NodeRowComponent = PropsWithChildren<
  IsAdminOrClinician &
    ProjectId & {
      row: Drug | Management
      searchTerm: string
      nodeType: 'drug' | 'management'
      nodeQuery: any
      lazyNodeQuery: any
      lazyNodesQuery: any
      destroyNode: any
      onEdit: (id: Scalars['ID']) => void
    }
>

export type RowComponent = FC<
  IsAdminOrClinician &
    ProjectId & {
      row: Management | Drug
      language: string
      searchTerm: string
    }
>

export type MenuCellComponent = FC<{
  itemId: Scalars['ID']
  onEdit?: (id: Scalars['ID']) => void
  onDestroy?: (id: Scalars['ID']) => void
  canEdit?: boolean
  canDestroy?: boolean
  onDestroy?: (id: Scalars['ID']) => void
  canDuplicate?: boolean
  onDuplicate?: (id: Scalars['ID']) => void
  onArchive?: (id: Scalars['ID']) => void
  onLock?: (id: Scalars['ID']) => void
  onUnlock?: (id: Scalars['ID']) => void
  onInfo?: (id: Scalars['ID']) => void
  showUrl?: string
}>

export type PaginationComponent = FC<TableStateProps>

export type ToolbarComponent = FC<
  TableBaseProps & {
    setTableState: React.Dispatch<React.SetStateAction<TableState>>
  }
>
