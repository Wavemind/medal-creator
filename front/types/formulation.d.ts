/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { ProjectId, DescriptionTranslations, Languages } from './common'
import type { FormulationInput, Scalars } from './graphql'

export type FormulationInputs = Omit<
  FormulationInput,
  | 'id'
  | 'descriptionTranslations'
  | 'injectionInstructionsTranslations'
  | 'dispensingDescriptionTranslations'
> & {
  formulationId?: Scalars['ID']
  description?: string
  injectionInstructions?: string
  dispensingDescription?: string
}

export type FormulationQuery = Omit<
  FormulationInputs,
  'description' | 'injectionInstructions' | 'dispensingDescription'
> & {
  dispensingDescriptionTranslations: Languages
  injectionInstructionsTranslations: Languages
} & DescriptionTranslations

export type EditFormulationQuery = Omit<
  FormulationQuery,
  'administrationRouteId'
> & {
  administrationRoute: AdministrationRoute
  formulationId: Scalars['ID']
}

export type FormulationComponent = FC<ProjectId & { index: number }>
export type FormulationsComponent = FC<ProjectId>
