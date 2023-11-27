/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { UpdatableNodeValues } from './node'
import { ManagementInput, Scalars } from './graphql'

export type ManagementFormComponent = FC<{
  managementId?: Scalars['ID']
  callback?: (variable: UpdatableNodeValues) => void
}>

export type ManagementInputs = Omit<
  ManagementInput,
  'id' | 'labelTranslations' | 'descriptionTranslations'
> & {
  label?: string
  description?: string
}
