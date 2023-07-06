/**
 * The internal imports
 */
import { DiagramType } from '@/lib/config/constants'
import type { Scalars } from './graphql'

export type MediaType = {
  id: Scalars['ID']
  name: string
  url: string
  size: number
  extension: string
}

export type DependenciesByAlgorithm = {
  title: string
  dependencies: Array<{
    id: Scalars['ID']
    label: string
    type: string
  }>
}

export type AvailableNodeInput = {
  instanceableId: string
  instanceableType: DiagramType
  searchTerm: string
}
