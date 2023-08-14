/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { ProjectId, AlgorithmId } from './common'
import type { AlgorithmInput } from './graphql'

export type AlgorithmInputs = Omit<
  AlgorithmInput,
  'id' | 'projectId' | 'descriptionTranslations' | 'ageLimitMessageTranslations'
> & {
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmFormComponent = FC<ProjectId & Partial<AlgorithmId>>
