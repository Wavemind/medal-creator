import * as yup from 'yup'

/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import {
  AnswerTypesEnum,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
  OperatorsEnum,
  RoundsEnum,
  StagesEnum,
} from '@/lib/config/constants'
import { AnswerService } from '@/lib/services'
import {
  AnswerInputs,
  CustomTFunction,
  StringIndexType,
  VariableCategoryEnum,
  VariableInputs,
  VariableInputsForm,
} from '@/types'
import type validations from '@/public/locales/en/validations.json'

class Variable {
  private static instance: Variable
  categories: Array<VariableCategoryEnum>
  stages: Array<StagesEnum>
  emergencyStatuses: Array<EmergencyStatusesEnum>
  rounds: Array<RoundsEnum>
  operators: Array<OperatorsEnum>

  constructor() {
    this.categories = Object.values(VariableCategoryEnum)
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

  public extractCategoryKey(category: VariableCategoryEnum | string): string {
    const prefix = 'Variables::'
    const key = category
    if (key.startsWith(prefix)) {
      return camelize(key.slice(prefix.length))
    }
    return key
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
      description: yup.string().label(t('description')),
      isEstimable: yup.boolean().label(t('isEstimable')),
      emergencyStatus: yup
        .mixed()
        .oneOf(Object.values(EmergencyStatusesEnum))
        .label(t('emergencyStatus')),
      formula: yup
        .string()
        .label(t('formula'))
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
        .when('maxValueError', {
          is: (maxValueError: number | undefined) =>
            maxValueError !== undefined,
          then: schema => schema.required(),
        }),
      maxMessageWarning: yup
        .string()
        .label(t('maxMessageWarning'))
        .when('maxValueWarning', {
          is: (maxValueWarning: number | undefined) =>
            maxValueWarning !== undefined,
          then: schema => schema.required(),
        }),
      minMessageError: yup
        .string()
        .label(t('minMessageError'))
        .when('minValueError', {
          is: (minValueError: number | undefined) =>
            minValueError !== undefined,
          then: schema => schema.required(),
        }),
      minMessageWarning: yup
        .string()
        .label(t('minMessageWarning'))
        .when('minValueWarning', {
          is: (minValueWarning: number | undefined) =>
            minValueWarning !== undefined,
          then: schema => schema.required(),
        }),
      placeholder: yup.string().label(t('placeholder')),
      round: yup.mixed().oneOf(Object.values(RoundsEnum)).label(t('round')),
      system: yup
        .string()
        .label(t('system'))
        .when('type', {
          is: (type: VariableCategoryEnum) =>
            CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: schema => schema.required(),
        }),
      stage: yup
        .string()
        .label(t('stage'))
        .when('type', {
          is: (type: VariableCategoryEnum) =>
            !CATEGORIES_WITHOUT_STAGE.includes(type),
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

  public validateOverlap(answers: AnswerInputs[] | undefined): {
    isOverlapValid: boolean
    message?: keyof typeof validations.overlap
  } {
    if (answers) {
      // Only one more or equal
      const moreOrEquals = answers.filter(
        answer => answer.operator === OperatorsEnum.MoreOrEqual
      )

      const lesses = answers.filter(
        answer => answer.operator === OperatorsEnum.Less
      )

      const betweens = answers.filter(
        answer => answer.operator === OperatorsEnum.Between
      )

      // Early return, can't have only one more or equal or less
      if (moreOrEquals.length !== 1) {
        return { isOverlapValid: false, message: 'oneMoreOrEqual' }
      }

      if (lesses.length !== 1) {
        return { isOverlapValid: false, message: 'oneLess' }
      }

      if (
        moreOrEquals[0].value &&
        lesses[0].value &&
        parseFloat(moreOrEquals[0].value) < parseFloat(lesses[0].value)
      ) {
        return { isOverlapValid: false, message: 'lessGreaterThanMoreOrEqual' }
      }

      // Early return
      if (
        betweens.length === 0 &&
        moreOrEquals[0].value &&
        lesses[0].value &&
        parseFloat(moreOrEquals[0].value) !== parseFloat(lesses[0].value)
      ) {
        return { isOverlapValid: false, message: 'lessEqualMoreOrEqual' }
      }

      const tempBetweens: number[][] = []
      betweens.forEach(answer => {
        if (answer.startValue && answer.endValue) {
          tempBetweens.push([
            parseFloat(answer.startValue),
            parseFloat(answer.endValue),
          ])
        }
      })

      // Sort betweens by minimal value
      tempBetweens.sort((a, b) => a[0] - b[0])

      for (let index = 0; index < tempBetweens.length; index++) {
        const between = tempBetweens[index]

        if (
          index === 0 &&
          lesses[0].value &&
          between[0] !== parseFloat(lesses[0].value)
        ) {
          return {
            isOverlapValid: false,
            message: 'firstBetweenDifferentFromLess',
          }
        }
        if (
          index === tempBetweens.length - 1 &&
          moreOrEquals[0].value &&
          between[1] !== parseFloat(moreOrEquals[0].value)
        ) {
          return {
            isOverlapValid: false,
            message: 'lastBetweenDifferentFromMoreOrEqual',
          }
        }
        if (
          index < tempBetweens.length - 1 &&
          between[1] !== tempBetweens[index + 1][0]
        ) {
          return {
            isOverlapValid: false,
            message: 'betweenNotFollowing',
          }
        }
      }

      // All good !
      return {
        isOverlapValid: true,
      }
    }
    return { isOverlapValid: false, message: 'noAnswers' }
  }
}

export const VariableService = Variable.getInstance()
