export type MediaType = {
  id: string
  name: string
  url: string
  size: number
  extension: string
}

export type DependenciesByAlgorithm = {
  title: string
  dependencies: Array<{
    id: number
    label: string
    type: string
  }>
}
