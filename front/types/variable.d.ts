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

export type DefaultAnswerProps = { isUnavailable?: boolean } & (
  | {
      operator: OperatorsEnum.Less | OperatorsEnum.MoreOrEqual
      value: string
      startValue: never
      endValue: never
    }
  | {
      operator: OperatorsEnum.Between
      startValue: string
      endValue: string
      value: never
    }
)

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
  complaintCategoryOptions?: { label: string; value: string }[]
  filesToAdd: File[]
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
    type: VariableTypesEnum
    dependenciesByAlgorithm: Array<{
      title: string
      dependencies: Array<{ label: string; id: number; type: string }>
    }>
  }

export type VariableComponent = FC<{ variableId: number }>

export type AnswerComponent = FC<ProjectId>

export type AnswerLineComponent = FC<{
  field: Record<'id', string>
  index: number
  projectId: number
  handleRemove: (index: number) => void
}>
