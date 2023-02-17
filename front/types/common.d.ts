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

export type StringIndexType = {
  [key: string]: string
}

export type NumberIndexType = {
  [key: string]: number
}

export type MenuOptions = {
  [key: string]: {
    label: string
    path: (props: NumberIndexType) => string
    key: string
  }[]
}

export type Element = {
  id: number
  isAdmin: boolean
}

export type PaginatedQueryWithProject = TableState & {
  projectId: string | null
}

export type LabelTranslations = {
  labelTranslations: StringIndexType
}

export type DescriptionTranslations = {
  descriptionTranslations: StringIndexType
}

export type ComponentStackProps = {
  componentStack: string
} | null
