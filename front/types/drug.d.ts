/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { UpdatableNodeValues } from './node'
import type { DrugInput } from './graphql'

export type DrugStepperComponent = FC<{
  drugId?: string
  callback?: (variable: UpdatableNodeValues) => void
  skipClose?: boolean
}>

export type DrugInputs = Omit<
  DrugInput,
  'id' | 'labelTranslations' | 'descriptionTranslations' | 'isDangerSign'
> & {
  label?: string
  description?: string
}

export type DrugFormComponent = FC<{ isRestricted: boolean }>
