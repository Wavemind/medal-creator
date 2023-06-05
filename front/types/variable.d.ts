/**
 * The internal imports
 */
import type { FC } from 'react'
import type {
  LabelTranslations,
  DescriptionTranslations,
  ProjectId,
  StringIndexType,
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
      value: never
      startValue?: string
      endValue?: string
    }
)

export type AnswerInputs = DefaultAnswerProps &
  LabelTranslations & { label?: string }

export type VariableInputsForm = {
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
  maxValueError?: string
  maxValueWarning?: string
  minValueError?: string
  minValueWarning?: string
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

export type VariableInputs = LabelTranslations &
  DescriptionTranslations & {
    answersAttributes?: Array<AnswerInputs>
    answerType: string
    isEstimable: boolean
    projectId: string
    emergencyStatus?: EmergencyStatusesEnum
    formula?: string
    isMandatory: boolean
    isIdentifiable: boolean
    isPreFill: boolean
    isNeonat: boolean
    maxValueError?: string
    maxValueWarning?: string
    minValueError?: string
    minValueWarning?: string
    placeholder?: string
    round?: RoundsEnum
    system?: string
    stage?: string
    type: VariableTypesEnum
    isUnavailable: boolean
    complaintCategoryOptions?: { label: string; value: string }[]
    filesToAdd: File[]
    maxMessageErrorTranslations: StringIndexType
    minMessageErrorTranslations: StringIndexType
    minMessageWarningTranslations: StringIndexType
    maxMessageWarningTranslations: StringIndexType
    placeholderTranslations: StringIndexType
    complaintCategoryIds: number[] | undefined
  }

export type VariableComponent = FC<{ variableId: string }>

export type AnswerComponent = FC<ProjectId>

export type AnswerLineComponent = FC<ProjectId & {
  field: Record<'id', string>
  index: number
  handleRemove: (index: number) => void
}>

export type VariableFormComponent = FC<
  ProjectId & {
    answerTypes: Array<AnswerType>
  }
>
