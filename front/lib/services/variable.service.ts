import * as yup from 'yup'

/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import {
  AnswerTypesEnum,
  CATEGORIES_DISPLAYING_SYSTEM,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
  OperatorsEnum,
  RoundsEnum,
  StagesEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import { AnswerService } from '@/lib/services'
import {
  CustomTFunction,
  EditVariable,
  StringIndexType,
  VariableInputs,
  VariableInputsForm,
} from '@/types'

class Variable {
  private static instance: Variable
  categories: Array<VariableTypesEnum>
  stages: Array<StagesEnum>
  emergencyStatuses: Array<EmergencyStatusesEnum>
  rounds: Array<RoundsEnum>
  operators: Array<OperatorsEnum>

  constructor() {
    this.categories = Object.values(VariableTypesEnum)
    this.stages = Object.values(StagesEnum)
    this.emergencyStatuses = Object.values(EmergencyStatusesEnum)
    this.rounds = Object.values(RoundsEnum)
    this.operators = Object.values(OperatorsEnum)
  }

  public static getInstance(): Variable {
    if (!Variable.instance) {
      Variable.instance = new Variable()
    }

    return Variable.instance
  }

  public extractCategoryKey(category: VariableTypesEnum): string {
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
    projectId: number
  ): VariableInputs {
    return {
      label: data.labelTranslations[projectLanguageCode],
      description: data.descriptionTranslations[projectLanguageCode],
      minMessageError: data.minMessageErrorTranslations[projectLanguageCode],
      maxMessageError: data.maxMessageErrorTranslations[projectLanguageCode],
      maxMessageWarning:
        data.maxMessageWarningTranslations[projectLanguageCode],
      minMessageWarning:
        data.minMessageWarningTranslations[projectLanguageCode],
      answerType: data.answerType.id,
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
      placeholder: data.placeholderTranslations[projectLanguageCode],
      projectId: String(projectId),
      round: data.round,
      stage: data.stage,
      isUnavailable: data.isUnavailable,
      complaintCategoryOptions: data.nodeComplaintCategories?.map(NCC => ({
        value: String(NCC.complaintCategory.id),
        label: NCC.complaintCategory.labelTranslations[projectLanguageCode],
      })),
    }
  }

  /**
   * Transforms the data by cloning it, performing translations, and modifying the structure.
   * @param data form data
   * @param projectLanguageCode default language of project
   * @returns VariableInputs
   */
  public transformData(
    data: VariableInputsForm,
    projectLanguageCode: string | undefined
  ): VariableInputs {
    const tmpData: VariableInputsForm = structuredClone(data)
    const labelTranslations: StringIndexType = {}
    const descriptionTranslations: StringIndexType = {}
    const maxMessageErrorTranslations: StringIndexType = {}
    const minMessageErrorTranslations: StringIndexType = {}
    const minMessageWarningTranslations: StringIndexType = {}
    const maxMessageWarningTranslations: StringIndexType = {}
    const placeholderTranslations: StringIndexType = {}

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

    tmpData.answersAttributes?.forEach(answerAttribute => {
      answerAttribute.labelTranslations = {}
      HSTORE_LANGUAGES.forEach(language => {
        answerAttribute.labelTranslations[language] =
          language === projectLanguageCode && answerAttribute.label
            ? answerAttribute.label
            : ''
      })
      if (answerAttribute.startValue && answerAttribute.endValue) {
        answerAttribute.value = `${answerAttribute.startValue},${answerAttribute.endValue}`
        delete answerAttribute.startValue
        delete answerAttribute.endValue
      }

      delete answerAttribute.label

      if (answerAttribute.answerId) {
        answerAttribute.id = answerAttribute.answerId
        delete answerAttribute.answerId
      }
    })

    const complaintCategoryIds = tmpData.complaintCategoryOptions?.map(cc =>
      parseInt(cc.value)
    )

    delete tmpData.label
    delete tmpData.description
    delete tmpData.maxMessageError
    delete tmpData.minMessageError
    delete tmpData.minMessageWarning
    delete tmpData.maxMessageWarning
    delete tmpData.placeholder
    delete tmpData.complaintCategoryOptions

    return {
      labelTranslations,
      descriptionTranslations,
      maxMessageErrorTranslations,
      minMessageErrorTranslations,
      minMessageWarningTranslations,
      maxMessageWarningTranslations,
      placeholderTranslations,
      complaintCategoryIds,
      ...tmpData,
    }
  }

  /**
   * Returns a Yup validation schema for the variable object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object({
      answerType: yup.string().trim().label('answerType').required(),
      answersAttributes: yup
        .array()
        .label(t('answers'))
        .when('answerType', {
          is: (answerType: string) =>
            !NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(parseInt(answerType)),
          then: schema =>
            schema.of(AnswerService.getValidationSchema(t)).min(1).required(),
        }),
      description: yup.string().nullable().label(t('description')),
      isEstimable: yup.boolean().label(t('isEstimable')),
      emergencyStatus: yup
        .mixed()
        .oneOf(Object.values(EmergencyStatusesEnum))
        .label(t('emergencyStatus')),
      formula: yup
        .string()
        .label(t('formula'))
        .nullable()
        .when('answerType', {
          is: (answerType: string) =>
            parseInt(answerType) === AnswerTypesEnum.FormulaFloat,
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
        .oneOf(Object.values(RoundsEnum))
        .nullable()
        .label(t('round')),
      system: yup
        .string()
        .label(t('system'))
        .nullable()
        .when('type', {
          is: (type: VariableTypesEnum) =>
            CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: schema => schema.required(),
        }),
      type: yup
        .mixed()
        .oneOf(Object.values(VariableTypesEnum))
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
    minValueError?: string
    maxValueError?: string
    minValueWarning?: string
    maxValueWarning?: string
  }): boolean {
    const values: number[] = []
    if (minValueError) values.push(parseFloat(minValueError))
    if (minValueWarning) values.push(parseFloat(minValueWarning))
    if (maxValueWarning) values.push(parseFloat(maxValueWarning))
    if (maxValueError) values.push(parseFloat(maxValueError))

    const sortedValues = [...values].sort((a, b) => a - b)
    return JSON.stringify(values) === JSON.stringify(sortedValues)
  }
}

export const VariableService = Variable.getInstance()
