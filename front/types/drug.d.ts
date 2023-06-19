/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  LabelTranslations,
  ProjectId,
  DescriptionTranslations,
} from './common'
import type { FormulationInputs, FormulationQuery } from './formulation'

export type Drug = LabelTranslations & {
  id: number
  isNeonat: boolean
  isAntibiotic: boolean
  isAntiMalarial: boolean
  isDefault: boolean
  hasInstances: boolean
}

export type DrugStepperComponent = FC<ProjectId & { drugId?: number }>

export type DrugInputs = ProjectId & {
  label?: string
  description?: string
  isNeonat: boolean
  isAntibiotic: boolean
  isAntiMalarial: boolean
  levelOfUrgency: number
  formulationsAttributes: FormulationInputs[]
}

export type DrugQuery = ProjectId &
  LabelTranslations &
  DescriptionTranslations & {
    id?: number
    isNeonat: boolean
    isAntibiotic: boolean
    isAntiMalarial: boolean
    levelOfUrgency: number
    formulationsAttributes: FormulationQuery[]
  }

export type DrugFormComponent = FC<ProjectId>
