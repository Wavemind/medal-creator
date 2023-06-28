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
import type {
  EditFormulationQuery,
  FormulationInputs,
  FormulationQuery,
} from './formulation'

export type DrugStepperComponent = FC<ProjectId & { drugId?: string }>

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

// export type EditDrug = LabelTranslations &
//   DescriptionTranslations & {
//     id: number
//     isNeonat: boolean
//     isAntibiotic: boolean
//     isAntiMalarial: boolean
//     levelOfUrgency: number
//     formulations: EditFormulationQuery[]
//   }

export type DrugFormComponent = FC<ProjectId>
