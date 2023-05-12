/**
 * The internal imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'
import type {
  LabelTranslations,
  DescriptionTranslations,
  ProjectId,
} from './common'

export type VariableStepperComponent = FC<ProjectId>

export type Variable = LabelTranslations &
  DescriptionTranslations & {
    id: number
    isNeonat: boolean
    isMandatory: boolean
    hasInstances: boolean
    answerType: {
      value: string
    }
    type: string
    dependenciesByAlgorithm: Array<{
      title: string
      dependencies: Array<{ label: string; id: number; type: string }>
    }>
  }

export type VariableComponent = FC<{ variableId: number }>

export type MediaComponent = FC<{
  filesToAdd: File[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
