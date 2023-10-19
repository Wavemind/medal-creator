/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { DrugInput } from './graphql'

export type DrugStepperComponent = FC<{ drugId?: string }>

export type DrugInputs = Omit<
  DrugInput,
  'id' | 'labelTranslations' | 'descriptionTranslations' | 'isDangerSign'
> & {
  label?: string
  description?: string
}

export type DrugFormComponent = FC
