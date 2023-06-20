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
  id?: number | string
  administrationRouteId: number
  minimalDosePerKg?: number | null
  maximalDosePerKg?: number | null
  maximalDose?: number | null
  medicationForm: MedicationFormEnum
  doseForm?: number | null
  liquidConcentration?: number | null
  dosesPerDay?: number
  uniqueDose?: number | null
  breakable?: string | null
  byAge?: boolean
  description?: string
  injectionInstructions?: string
  dispensingDescription?: string
  formulationId?: number
  _destroy?: boolean
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
