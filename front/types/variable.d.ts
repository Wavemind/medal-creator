/**
 * The internal imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'
import type {
  LabelTranslations,
  DescriptionTranslations,
  ProjectId,
} from './common'
import {
  EmergencyStatusesEnum,
  OperatorsEnum,
  RoundsEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'

export type VariableStepperComponent = FC<ProjectId>

export type DefaultAnswerProps = {
  operator: OperatorsEnum
  value: string
  isUnavailable?: boolean
}

export type AnswerInputs = DefaultAnswerProps &
  LabelTranslations & { label?: string }

// TODO: FIX IT
export type VariableInputs = {
  answersAttributes?: Array<AnswerInputs>
  answerType: string
  description?: string
  isEstimable: boolean
  projectId: string
  emergencyStatus?: EmergencyStatusesEnum
  formula?: string
  isMandatory: boolean
  isIdentifiable: boolean
  isPreFill: boolean
  isNeonat: boolean
  label?: string
  maxMessageError?: string
  maxMessageWarning?: string
  maxValueError?: number
  maxValueWarning?: number
  minValueError?: number
  minValueWarning?: number
  minMessageError?: string
  minMessageWarning?: string
  placeholder?: string
  round?: RoundsEnum
  system?: string
  stage?: string
  type: VariableTypesEnum
  isUnavailable: boolean
}

// TODO: Add info here
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

export type AnswerComponent = FC<ProjectId>

export type MediaComponent = FC<{
  filesToAdd: File[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
