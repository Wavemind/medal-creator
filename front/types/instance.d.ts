/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import { DiagramEnum, InstanceInput } from './graphql'

export type InstanceFormComponent = FC<{
  nodeId?: string
  instanceId?: Scalars['ID']
  instanceableType: DiagramEnum
  instanceableId: string
  diagnosisId?: string
  positionX?: number
  positionY?: number
  callback?: (variable: UpdatableNodeValues) => void
}>

export type InstanceInputs = Omit<
  InstanceInput,
  'id' | 'durationTranslations' | 'descriptionTranslations'
> & {
  duration?: string
  description?: string
}
