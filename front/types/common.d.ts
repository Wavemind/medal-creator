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
