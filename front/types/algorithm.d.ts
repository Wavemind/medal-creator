/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { ProjectId, AlgorithmId } from './common'
import type { TreeNodeModel } from './tree'

export type AlgorithmInputs = {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
  algorithmLanguages: string[]
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmOrder = UsedVariables & {
  id: number
  name: string
  formattedConsultationOrder: TreeNodeModel[]
}

export type UsedVariables = {
  usedVariables: number[]
}

export type AlgorithmFormComponent = FC<ProjectId & Partial<AlgorithmId>>
