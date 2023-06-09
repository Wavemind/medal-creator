import * as yup from 'yup'

/**
 * The internal imports
 */
import { camelize, extractTranslation } from '@/lib/utils'
import {
  AnswerTypesEnum,
  CATEGORIES_DISPLAYING_SYSTEM,
  HSTORE_LANGUAGES,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
  StagesEnum,
} from '@/lib/config/constants'
import { AnswerService } from '@/lib/services'
import type { EditVariable } from '../api/modules'
import {
  AnswerInputs,
  CustomTFunction,
  OperatorEnum,
  RoundEnum,
  EmergencyStatusEnum,
  Scalars,
  VariableCategoryEnum,
  VariableInputsForm,
  VariableInput,
  InputMaybe,
  Languages,
} from '@/types'

class Variable {
  private static instance: Variable
  categories: Array<VariableCategoryEnum>
  stages: Array<StagesEnum>
  emergencyStatuses: Array<EmergencyStatusEnum>
  rounds: Array<RoundEnum>
  operators: Array<OperatorEnum>

  constructor() {
    this.categories = Object.values(VariableCategoryEnum)
    this.stages = Object.values(StagesEnum)
    this.emergencyStatuses = Object.values(EmergencyStatusEnum)
    this.rounds = Object.values(RoundEnum)
    this.operators = Object.values(OperatorEnum)
  }

  public static getInstance(): Variable {
    if (!Variable.instance) {
      Variable.instance = new Variable()
    }

    return Variable.instance
  }

  public extractCategoryKey(category: VariableCategoryEnum): string {
    const prefix = 'Variables::'
    const key = category
    if (key.startsWith(prefix)) {
      return camelize(key.slice(prefix.length))
    }
    return key
  }

  public buildFormData(
    data: EditVariable,
    projectLanguageCode: string,
    projectId: Scalars['ID']
  ): VariableInputsForm {
    return {
      label: extractTranslation(data.labelTranslations, projectLanguageCode),
      description: extractTranslation(
        data.descriptionTranslations,
        projectLanguageCode
      ),
      minMessageError: extractTranslation(
        data.minMessageErrorTranslations,
        projectLanguageCode
      ),
      maxMessageError: extractTranslation(
        data.maxMessageErrorTranslations,
        projectLanguageCode
      ),
      maxMessageWarning: extractTranslation(
        data.maxMessageWarningTranslations,
        projectLanguageCode
      ),
      minMessageWarning: extractTranslation(
        data.minMessageWarningTranslations,
        projectLanguageCode
      ),
      answerTypeId: data.answerType.id,
      answersAttributes: AnswerService.buildExistingAnswers(
        data.answers,
        projectLanguageCode
      ),
      type: data.type,
      system: data.system,
      emergencyStatus: data.emergencyStatus,
      formula: data.formula,
      isEstimable: data.isEstimable,
      isMandatory: data.isMandatory,
      isIdentifiable: data.isIdentifiable,
      isPreFill: data.isPreFill,
      isNeonat: data.isNeonat,
      maxValueError: data.maxValueError,
      maxValueWarning: data.maxValueWarning,
      minValueError: data.minValueError,
      minValueWarning: data.minValueWarning,
      placeholder: extractTranslation(
        data.placeholderTranslations,
        projectLanguageCode
      ),
      projectId: String(projectId),
      round: data.round,
      isUnavailable: data.isUnavailable,
      filesToAdd: [],
      complaintCategoryOptions: data.nodeComplaintCategories?.map(NCC => ({
        value: String(NCC.complaintCategory.id),
        label: extractTranslation(
          NCC.complaintCategory.labelTranslations,
          projectLanguageCode
        ),
      })),
    }
  }

  /**
   * Transforms the data by cloning it, performing translations, and modifying the structure to match the API
   * @param data form data
   * @param projectLanguageCode default language of project
   * @returns VariableInput
   */
  public transformData(
    data: VariableInputsForm,
    projectLanguageCode: string | undefined
  ): VariableInput {
    const tmpData = structuredClone(data)

    const labelTranslations: Languages = {}
    const descriptionTranslations: Languages = {}
    const maxMessageErrorTranslations: Languages = {}
    const minMessageErrorTranslations: Languages = {}
    const minMessageWarningTranslations: Languages = {}
    const maxMessageWarningTranslations: Languages = {}
    const placeholderTranslations: Languages = {}

    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === projectLanguageCode && tmpData.label ? tmpData.label : ''
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''

      maxMessageErrorTranslations[language] =
        language === projectLanguageCode && tmpData.maxMessageError
          ? tmpData.maxMessageError
          : ''
      minMessageErrorTranslations[language] =
        language === projectLanguageCode && tmpData.minMessageError
          ? tmpData.minMessageError
          : ''
      minMessageWarningTranslations[language] =
        language === projectLanguageCode && tmpData.minMessageWarning
          ? tmpData.minMessageWarning
          : ''
      maxMessageWarningTranslations[language] =
        language === projectLanguageCode && tmpData.maxMessageWarning
          ? tmpData.maxMessageWarning
          : ''
      placeholderTranslations[language] =
        language === projectLanguageCode && tmpData.placeholder
          ? tmpData.placeholder
          : ''
    })

    const tmpAnswerAttributes = [] as AnswerInputs[]
    tmpData.answersAttributes?.forEach(answerAttribute => {
      const tmpAnswer: AnswerInputs = {
        labelTranslations: {},
      }
      HSTORE_LANGUAGES.forEach(language => {
        tmpAnswer.labelTranslations[
          language as keyof typeof tmpAnswer.labelTranslations
        ] =
          language === projectLanguageCode && answerAttribute.label
            ? answerAttribute.label
            : ''
      })

      if (answerAttribute.startValue && answerAttribute.endValue) {
        tmpAnswer.value = `${answerAttribute.startValue},${answerAttribute.endValue}`
      }

      if (answerAttribute.value) {
        tmpAnswer.value = answerAttribute.value
      }

      if (answerAttribute.answerId) {
        tmpAnswer.id = answerAttribute.answerId
      }

      if (answerAttribute.operator) {
        tmpAnswer.operator = answerAttribute.operator
      }

      tmpAnswerAttributes.push(tmpAnswer)
    })

    const complaintCategoryIds = tmpData.complaintCategoryOptions?.map(
      cc => cc.value
    )

    delete tmpData.label
    delete tmpData.description
    delete tmpData.maxMessageError
    delete tmpData.minMessageError
    delete tmpData.minMessageWarning
    delete tmpData.maxMessageWarning
    delete tmpData.placeholder
    delete tmpData.complaintCategoryOptions
    delete tmpData.answersAttributes

    return {
      labelTranslations,
      descriptionTranslations,
      maxMessageErrorTranslations,
      minMessageErrorTranslations,
      minMessageWarningTranslations,
      maxMessageWarningTranslations,
      placeholderTranslations,
      complaintCategoryIds,
      answersAttributes: tmpAnswerAttributes,
      answerTypeId: tmpData.answerTypeId,
      type: tmpData.type,
      system: tmpData.system,
      emergencyStatus: tmpData.emergencyStatus,
      formula: tmpData.formula,
      isEstimable: tmpData.isEstimable,
      isMandatory: tmpData.isMandatory,
      isIdentifiable: tmpData.isIdentifiable,
      isPreFill: tmpData.isPreFill,
      isNeonat: tmpData.isNeonat,
      maxValueError: tmpData.maxValueError,
      maxValueWarning: tmpData.maxValueWarning,
      minValueError: tmpData.minValueError,
      minValueWarning: tmpData.minValueWarning,
      projectId: tmpData.projectId,
      round: tmpData.round,
      isUnavailable: tmpData.isUnavailable,
    }
  }

  /**
   * Returns a Yup validation schema for the variable object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object({
      answerTypeId: yup.string().trim().label('answerType').required(),
      answersAttributes: yup
        .array()
        .label(t('answers'))
        .when('answerTypeId', {
          is: (answerTypeId: Scalars['ID']) =>
            !NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(parseInt(answerTypeId)),
          then: schema =>
            schema.of(AnswerService.getValidationSchema(t)).min(1).required(),
        }),
      description: yup.string().nullable().label(t('description')),
      isEstimable: yup.boolean().label(t('isEstimable')),
      emergencyStatus: yup
        .mixed()
        .oneOf(Object.values(EmergencyStatusEnum))
        .label(t('emergencyStatus')),
      formula: yup
        .string()
        .label(t('formula'))
        .nullable()
        .when('answerTypeId', {
          is: (answerTypeId: Scalars['ID']) =>
            parseInt(answerTypeId) === AnswerTypesEnum.FormulaFloat,
          then: schema => schema.required(),
        }),
      isMandatory: yup.boolean().label(t('isMandatory')),
      isIdentifiable: yup.boolean().label(t('isIdentifiable')),
      isPreFill: yup.boolean().label(t('isPreFill')),
      isNeonat: yup.boolean().label(t('isNeonat')),
      label: yup.string().label(t('label')).required(),
      maxValueError: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable()
        .label(t('maxValueError')),
      maxValueWarning: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable()
        .label(t('maxValueWarning')),
      minValueError: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable()
        .label(t('minValueError')),
      minValueWarning: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable()
        .label(t('minValueWarning')),
      maxMessageError: yup
        .string()
        .label(t('maxMessageError'))
        .nullable()
        .when('maxValueError', {
          is: (maxValueError: number | undefined) => !!maxValueError,
          then: schema => schema.required(),
        }),
      maxMessageWarning: yup
        .string()
        .label(t('maxMessageWarning'))
        .nullable()
        .when('maxValueWarning', {
          is: (maxValueWarning: number | undefined) => !!maxValueWarning,
          then: schema => schema.required(),
        }),
      minMessageError: yup
        .string()
        .label(t('minMessageError'))
        .nullable()
        .when('minValueError', {
          is: (minValueError: number | undefined) => !!minValueError,
          then: schema => schema.required(),
        }),
      minMessageWarning: yup
        .string()
        .label(t('minMessageWarning'))
        .nullable()
        .when('minValueWarning', {
          is: (minValueWarning: number | undefined) => !!minValueWarning,
          then: schema => schema.required(),
        }),
      placeholder: yup.string().nullable().label(t('placeholder')),
      round: yup
        .mixed()
        .oneOf(Object.values(RoundEnum))
        .nullable()
        .label(t('round')),
      system: yup
        .string()
        .label(t('system'))
        .nullable()
        .when('type', {
          is: (type: VariableCategoryEnum) =>
            CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: schema => schema.required(),
        }),
      type: yup
        .mixed()
        .oneOf(Object.values(VariableCategoryEnum))
        .label(t('type'))
        .required(),
      isUnavailable: yup.boolean().label(t('isUnavailable.unavailable')),
    })
  }

  public validateRanges({
    minValueError,
    maxValueError,
    minValueWarning,
    maxValueWarning,
  }: {
    minValueError?: InputMaybe<number>
    maxValueError?: InputMaybe<number>
    minValueWarning?: InputMaybe<number>
    maxValueWarning?: InputMaybe<number>
  }): boolean {
    const values: number[] = []
    if (minValueError) values.push(minValueError)
    if (minValueWarning) values.push(minValueWarning)
    if (maxValueWarning) values.push(maxValueWarning)
    if (maxValueError) values.push(maxValueError)

    const sortedValues = [...values].sort((a, b) => a - b)
    return JSON.stringify(values) === JSON.stringify(sortedValues)
  }
}

export const VariableService = Variable.getInstance()
