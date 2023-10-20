/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */

import type { AlgorithmId } from './common'
import type { AlgorithmInput, ImportTranslationsInput } from './graphql'

export type AlgorithmInputs = Omit<
  AlgorithmInput,
  'id' | 'projectId' | 'descriptionTranslations' | 'ageLimitMessageTranslations'
> & {
  description?: string
  ageLimitMessage?: string
}

export type MedalDataInputs = Pick<
  AlgorithmInput,
  'medalDataConfigVariablesAttributes'
>

export type TranslationsInputs = Omit<
  ImportTranslationsInput,
  'id' | 'clientMutationId'
>

export type AlgorithmFormComponent = FC<Partial<AlgorithmId>>
