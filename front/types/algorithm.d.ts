/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { ProjectId, AlgorithmId } from './common'

export type AlgorithmInputs = {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
  algorithmLanguages: string[]
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmFormComponent = FC<ProjectId & Partial<AlgorithmId>>
