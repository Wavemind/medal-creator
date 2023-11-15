/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import { DiagramEnum, InstanceInput } from './graphql'

// TODO: Finish this
export type InstanceFormComponent = FC<{
  nodeId?: string
  instanceId?: Scalars['ID']
  instanceableType: DiagramEnum
  instanceableId: string
  diagnosisId?: string
  callback?: (variable: UpdatableNodeValues) => void
}>

export type InstanceInputs = Omit<
  InstanceInput,
  'id' | 'durationTranslations' | 'descriptionTranslations'
> & {
  duration?: string
  description?: string
}
