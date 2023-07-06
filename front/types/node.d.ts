/**
 * The internal imports
 */
import { DiagramType } from '@/lib/config/constants'

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

export type AvailableNodeInput = {
  instanceableId: string
  instanceableType: DiagramType
  searchTerm: string
}
