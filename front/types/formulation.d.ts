/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  StringIndexType,
  ProjectId,
  DescriptionTranslations,
} from './common'
import { MedicationFormEnum } from '@/lib/config/constants'

export type AdministrationRoute = {
  id: number
  category: string
  nameTranslations: StringIndexType
}

export type FormulationInputs = {
  id?: number
  administrationRouteId: number
  minimalDosePerKg?: number
  maximalDosePerKg?: number
  maximalDose?: number
  medicationForm: MedicationFormEnum
  doseForm?: number
  liquidConcentration?: number
  dosesPerDay?: number
  uniqueDose?: number
  breakable?: string
  byAge?: boolean
  description?: string
  injectionInstructions?: string
  dispensingDescription?: string
}

export type FormulationQuery = Omit<
  FormulationInputs,
  'description' | 'injectionInstructions' | 'dispensingDescription'
> & {
  dispensingDescriptionTranslations: StringIndexType
  injectionInstructionsTranslations: StringIndexType
} & DescriptionTranslations

export type EditFormulationQuery = Omit<
  FormulationQuery,
  'administrationRouteId'
> & {
  administrationRoute: AdministrationRoute
  formulationId: number
}

export type FormulationComponent = FC<ProjectId & { index: number }>
export type FormulationsComponent = FC<ProjectId>
