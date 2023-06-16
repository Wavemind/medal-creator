/**
 * The internal imports
 */
import type { StringIndexType, ProjectId } from './common'
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
  doseForm: number
  liquidConcentration?: number
  dosesPerDay?: number
  uniqueDose?: number
  breakable?: string
  byAge?: boolean
  description?: string
  injectionInstructions?: string
  dispensingDescription?: string
}

export type FormulationComponent = FC<ProjectId & { index: number }>
export type FormulationsComponent = FC<ProjectId>
