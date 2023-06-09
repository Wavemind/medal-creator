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
} from '@/lib/config/constants'
import { VariableCategoryEnum } from './graphql'
import { ComplaintCategory, MediaType } from './node'

export type VariableStepperComponent = FC<ProjectId & { variableId?: string }>

export type DefaultAnswerProps = {
  id?: string
  label?: string
  operator?: OperatorsEnum
  isUnavailable?: boolean
  answerId?: string
  value?: string
  startValue?: string
  endValue?: string
  _destroy?: boolean
}

export type AnswerInputs = DefaultAnswerProps & LabelTranslations

export type VariableInputsForm = {
  answersAttributes?: Array<DefaultAnswerProps>
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
  type: VariableCategoryEnum
  isUnavailable: boolean
  complaintCategoryOptions?: { label: string; value: string }[]
  filesToAdd: File[]
}

export type VariableInputs = LabelTranslations &
  DescriptionTranslations & {
    id?: number
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
    type: VariableCategoryEnum
    isUnavailable: boolean
    complaintCategoryOptions?: { label: string; value: string }[]
    filesToAdd: File[]
    existingFilesToRemove?: number[]
    maxMessageErrorTranslations: StringIndexType
    minMessageErrorTranslations: StringIndexType
    minMessageWarningTranslations: StringIndexType
    maxMessageWarningTranslations: StringIndexType
    placeholderTranslations: StringIndexType
    complaintCategoryIds: number[] | undefined
  }

export type VariableComponent = FC<{ variableId: string }>

export type EditVariable = LabelTranslations &
  DescriptionTranslations & {
    hasInstances?: boolean
    answers: Array<Answer>
    answerType: { id: string }
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
    nodeComplaintCategories?: { complaintCategory: ComplaintCategory }[]
    files: MediaType[]
    maxMessageErrorTranslations: StringIndexType
    minMessageErrorTranslations: StringIndexType
    minMessageWarningTranslations: StringIndexType
    maxMessageWarningTranslations: StringIndexType
    placeholderTranslations: StringIndexType
  }

// export type Answer = LabelTranslations & {
//   id: string
//   value?: string
//   operator?: OperatorsEnum
// }

// export type Variable = LabelTranslations &
//   DescriptionTranslations & {
//     id: number
//     isNeonat: boolean
//     isMandatory: boolean
//     hasInstances: boolean
//     answerType: {
//       value: string
//     }
//     isDefault: boolean
//     type: VariableTypesEnum
//     dependenciesByAlgorithm: Array<{
//       title: string
//       dependencies: Array<{ label: string; id: number; type: string }>
//     }>
//   }

export type VariableComponent = FC<{ variableId: number }>

export type AnswerComponent = FC<ProjectId & { existingAnswers?: Answer[] }>

export type AnswerLineComponent = FC<ProjectId & {
  field: Record<'id', string>
  index: number
  handleRemove: (index: number) => void
}>

export type VariableFormComponent = FC<
  ProjectId & {
    isEdit: boolean
  }
>
