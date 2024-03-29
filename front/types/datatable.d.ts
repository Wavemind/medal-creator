/**
 * The external imports
 */
import type { FC, PropsWithChildren } from 'react'

/**
 * The internal imports
 */
import type { Paginated } from './common'
import type { DecisionTree } from './decisionTree'
import type { NodeExclusion, QuestionsSequence, Scalars } from './graphql'
import type { Drug } from './drug'
import type { Management } from './management'
import type { UseLazyQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import type { QueryDefinition } from '@reduxjs/toolkit/query'

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
  | 'publications'
  | 'diagnosesExclusions'

export type TableColumns = {
  [key in TableList]: Column[]
}

export type TableState = {
  perPage: number
  pageIndex: number
  pageCount: number
  lastPerPage: number
  endCursor: string | undefined | null
  startCursor: string | undefined | null
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

export type RenderItemFn<Model extends object> = (
  el: Model,
  search: string
) => JSX.Element | undefined

export type DatatableComponent<PaginatedQuery extends Paginated<object>> =
  TableBaseProps & {
    apiQuery: UseLazyQuery<QueryDefinition<any, any, any, PaginatedQuery>>
    requestParams?: object
    renderItem: RenderItemFn<any>
    perPage?: number
    paginable?: boolean
  }

export type DecisionTreeRowComponent = FC<{
  row: DecisionTree
  searchTerm: string
}>

export type DiagnosisRowComponent = FC<{
  decisionTreeId: string
  searchTerm: string
}>

export type DrugRowComponent = FC<{
  row: Drug
  searchTerm: string
}>

export type ManagagementRowComponent = FC<{
  row: Management
  searchTerm: string
}>

export type DiagnosisExclusionRowComponent = FC<{
  row: NodeExclusion
  searchTerm: string
}>

// TODO : Try to fix the any for the nodeQuery type
export type NodeRowComponent = PropsWithChildren<{
  row: Drug | Management
  searchTerm: string
  nodeType: 'drug' | 'management'
  nodeQuery: any
  lazyNodeQuery: any
  lazyNodesQuery: any
  destroyNode: any
  onEdit: (id: Scalars['ID']) => void
}>

export type QuestionsSequenceRowComponent = FC<{
  row: QuestionsSequence
  searchTerm: string
}>

// TODO : Fix this, it doesnt work
export type RowComponent = FC<{
  row: Management | Drug
  language: string
  searchTerm: string
}>

type ActionName = 'edit' | 'destroy' | 'duplicate'

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
  resendInvitation?: (id: Scalars['ID']) => void
  showUrl?: string
  tooltip?: Partial<Record<ActionName, string>>
}>

export type PaginationComponent = FC<TableStateProps>

export type ToolbarComponent = FC<
  TableBaseProps & {
    setTableState: React.Dispatch<React.SetStateAction<TableState>>
  }
>
