/**
 * The external imports
 */
import { FormEnvironments } from '@/lib/config/constants'
import type { FC } from 'react'

/**
 * The internal imports
 */
import type { Index, LabelTranslations, ProjectId, VariableId } from './common'
import type {
  Scalars,
  VariableCategoryEnum,
  OperatorEnum,
  VariableInput,
} from './graphql'

export type VariableStepperComponent = FC<
  ProjectId &
    Partial<VariableId> & {
      formEnvironment?: FormEnvironment
    } & {
      callback: (data: InstantiatedNode) => void
    }
>

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

export type VariableInputsForm = Omit<
  VariableInput,
  | 'id'
  | 'answersAttributes'
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
  placeholder?: string
  minMessageWarning?: string
  minMessageError?: string
  maxMessageWarning?: string
  maxMessageError?: string
  stage?: string
  type: VariableCategoryEnum
  isUnavailable: boolean
  complaintCategoryOptions?: Array<{ label: string; value: string }>
  filesToAdd: File[]
}

export type VariableComponent = FC<VariableId>

export type AnswerComponent = FC<ProjectId & { existingAnswers?: Answer[] }>

export type AnswerLineComponent = FC<
  ProjectId &
    Index & {
      field: Record<'id', string>
      handleRemove: (index: number) => void
    }
>

export type VariableFormComponent = FC<
  ProjectId & {
    isEdit: boolean
    formEnvironment?: FormEnvironments
  }
>
