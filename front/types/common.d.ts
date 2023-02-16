export type Paginated<T> = {
  edges: { node: T }[]
}

export type PaginationInput = {
  projectId: number
  endCursor: string
  startCursor: string
  search: string
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
