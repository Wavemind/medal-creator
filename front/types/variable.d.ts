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
  RoundsEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'

export type VariableStepperComponent = FC<ProjectId>

export type VariableInputs = {
  answerType: string
  description: string
  estimable: boolean
  emergencyStatus: EmergencyStatusesEnum
  formula: string
  isMandatory: boolean
  isIdentifiable: boolean
  isPrefill: boolean
  isNeonat: boolean
  label: string
  maxMessageError: string
  maxMessageWarning: string
  maxValueError: number
  maxValueWarning: number
  minValueError: number
  minValueWarning: number
  minMessageError: string
  minMessageWarning: string
  placeholder: string
  round: RoundsEnum
  system: string
  stage: string
  type: VariableTypesEnum
  unavailable: boolean
}

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

export type AnswerTemplate = { label: string; operator: string; value: string }

export type AnswerComponent = FC<{
  answers: AnswerTemplate[]
  setAnswers: Dispatch<SetStateAction<AnswerTemplate[]>>
}>

export type MediaComponent = FC<{
  filesToAdd: File[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>
