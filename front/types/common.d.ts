/**
 * The internal imports
 */
import type { TableState } from './datatable'

export type Paginated<T> = {
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: string
    startCursor: string
  }
  totalCount: number
  edges: { node: { id: number } & T }[]
}

export type CustomPartial<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type PathProps = {
  [key: string]: string | string[] | undefined
}

export type MenuOptions = {
  [key: string]: {
    label: string
    path: (props: PathProps) => string
    key: string
  }[]
}

export type PaginatedQueryWithProject = Partial<TableState> & {
  projectId?: string | null
}

export type LabelTranslations = {
  labelTranslations: StringIndexType
}

export type ComponentStackProps = {
  componentStack: string
} | null

export type StringIndexType = {
  [key: string]: string
}

export type NumberIndexType = {
  [key: string]: number
}
