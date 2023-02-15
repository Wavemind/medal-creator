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

export type RenderItemFn<T> = (el: T, search: string) => JSX.Element

export type DatatableProps = TableBaseProps & {
  // TODO : This returns any... Check if this is what we want
  apiQuery: ReturnType<typeof useLazyQuery>
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
