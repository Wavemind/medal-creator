/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */

import type { AlgorithmId } from './common'
import type { Unpacked } from './utility'
import type {
  AlgorithmInput,
  ImportTranslationsInput,
  MedalDataConfigVariableInput,
} from './graphql'

export type AlgorithmInputs = Omit<
  AlgorithmInput,
  | 'id'
  | 'projectId'
  | 'descriptionTranslations'
  | 'ageLimitMessageTranslations'
  | 'medalDataConfigVariablesAttributes'
> & {
  description?: string
  ageLimitMessage?: string
}

export type MedalDataConfigVariableInputs = {
  medalDataConfigVariablesAttributes: Array<MedalDataConfigVariable>
}

type MedalDataConfigVariable = Omit<
  MedalDataConfigVariableInput,
  'algorithmId' | 'variableId'
> & {
  medalDataConfigId?: string
  variableValue: { label: string; value: string }
}

export type TranslationsInputs = Omit<
  ImportTranslationsInput,
  'id' | 'clientMutationId'
>

export type AlgorithmFormComponent = FC<Partial<AlgorithmId>>
