/**
 * The internal imports
 */
import type { TableState } from './datatable'

export type Paginated<T> = {
  edges: { node: T }[]
}

type PathProps = {
  [key: string]: number
}

export type MenuOptions = {
  [key: string]: {
    label: string
    path: (props: PathProps) => string
    key: string
  }[]
}

export type Element = {
  id: number
  isAdmin: boolean
}

export type PaginatedQueryWithProject = TableState & {
  projectId: number | null
}

export type LabelTranslations = {
  labelTranslations: { [key: string]: string }
}

export type DescriptionTranslations = {
  descriptionTranslations: { [key: string]: string }
}
