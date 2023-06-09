/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  LabelTranslations,
  DescriptionTranslations,
  ProjectId,
  StringIndexType,
  VariableId,
} from './common'
import type {
  Scalars,
  VariableCategoryEnum,
  OperatorEnum,
  EmergencyStatusEnum,
  RoundEnum,
  VariableInput,
} from './graphql'

export type VariableStepperComponent = FC<ProjectId & Partial<VariableId>>

export type DefaultAnswerProps = {
  id?: Scalars['ID']
  label?: string
  operator?: OperatorEnum
  isUnavailable?: boolean
  answerId?: string
  value?: string
  startValue?: string
  endValue?: string
  _destroy?: boolean
}

export type AnswerInputs = DefaultAnswerProps & LabelTranslations

// export type VariableInputsForm = {
//   answersAttributes?: Array<DefaultAnswerProps>
//   answerType: string
//   description?: string
//   isEstimable: boolean
//   projectId: string
//   emergencyStatus?: EmergencyStatusEnum
//   formula?: string
//   isMandatory: boolean
//   isIdentifiable: boolean
//   isPreFill: boolean
//   isNeonat: boolean
//   label?: string
//   maxMessageError?: string
//   maxMessageWarning?: string
//   maxValueError?: string
//   maxValueWarning?: string
//   minValueError?: string
//   minValueWarning?: string
//   minMessageError?: string
//   minMessageWarning?: string
//   placeholder?: string
//   round?: RoundEnum
//   system?: string
//   stage?: string
//   type: VariableCategoryEnum
//   isUnavailable: boolean
//   complaintCategoryOptions?: { label: string; value: string }[]
//   filesToAdd: File[]
// }

export type VariableInputsForm = Omit<
  VariableInput,
  | 'id'
  | 'answersAttributes'
  | 'answerTypeId'
  | 'descriptionTranslations'
  | 'labelTranslations'
  | 'minMessageWarningTranslations'
  | 'minMessageErrorTranslations'
  | 'maxMessageWarningTranslations'
  | 'maxMessageErrorTranslations'
  | 'placeholderTranslations'
> & {
  answersAttributes?: Array<DefaultAnswerProps>
  description?: string
  label?: string
  answerType: string,
  placeholder?: string
  minMessageWarning?: string
  minMessageError?: string
  maxMessageWarning?: string
  maxMessageError?: string
  stage?: string
  complaintCategoryOptions?: Array<{ label: string; value: string }>
  filesToAdd: File[]
}

export type VariableInputs = LabelTranslations &
  DescriptionTranslations & {
    id?: number
    answersAttributes?: Array<AnswerInputs>
    answerType: string
    isEstimable: boolean
    projectId: string
    emergencyStatus?: EmergencyStatusEnum
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
    round?: RoundEnum
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

export type VariableComponent = FC<VariableId>

export type AnswerComponent = FC<ProjectId & { existingAnswers?: Answer[] }>

export type AnswerLineComponent = FC<
  ProjectId & {
    field: Record<'id', string>
    index: number
    handleRemove: (index: number) => void
  }
>

export type VariableFormComponent = FC<
  ProjectId & {
    isEdit: boolean
  }
>
