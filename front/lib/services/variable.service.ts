import * as yup from 'yup'

/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import {
  AnswerTypesEnum,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_OPERATOR,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  HSTORE_LANGUAGES,
  NO_ANSWERS_ATTACHED_ANSWER_TYPE,
  OperatorsEnum,
  RoundsEnum,
  StagesEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import { AnswerService } from '@/lib/services'
import { CustomTFunction, StringIndexType, VariableInputs } from '@/types'

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

  public transformData(
    data: VariableInputs,
    projectLanguageCode: string | undefined
  ) {
    const tmpData: VariableInputs = structuredClone(data)
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
      delete answerAttribute.label
    })

    delete tmpData.label
    delete tmpData.description
    delete tmpData.maxMessageError
    delete tmpData.minMessageError
    delete tmpData.minMessageWarning
    delete tmpData.maxMessageWarning
    delete tmpData.placeholder

    return {
      labelTranslations,
      descriptionTranslations,
      maxMessageErrorTranslations,
      minMessageErrorTranslations,
      minMessageWarningTranslations,
      maxMessageWarningTranslations,
      placeholderTranslations,
      ...tmpData,
    }
  }

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
      overlap: yup.mixed().test('overlap', (_value, context) => {
        console.log(context)
        const { answerType, answersAttributes, type } = context.parent

        if (
          !NO_ANSWERS_ATTACHED_ANSWER_TYPE.includes(parseInt(answerType)) &&
          !CATEGORIES_WITHOUT_OPERATOR.includes(type)
        ) {
          console.log("Je valide l'overlap")
          return VariableService.validateOverlap(answersAttributes)
        }
        return true
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
          is: (type: VariableTypesEnum) =>
            CATEGORIES_DISPLAYING_SYSTEM.includes(type),
          then: schema => schema.required(),
        }),
      stage: yup
        .string()
        .label(t('stage'))
        .when('type', {
          is: (type: VariableTypesEnum) =>
            !CATEGORIES_WITHOUT_STAGE.includes(type),
          then: schema => schema.required(),
        }),
      type: yup
        .mixed()
        .oneOf(Object.values(VariableTypesEnum))
        .label(t('type'))
        .required(),
      isUnavailable: yup.boolean().label(t('isUnavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
    })
  }

  // TODO: TEST IT
  private validateOverlap(answers) {
    console.log('#####################################################')
    console.log('validateOverlap')
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
      // if (moreOrEquals.length !== 1 || lesses.length !== 1) {
      //   return false
      // }

      console.log('moreOrEquals[0].value', moreOrEquals[0].value)
      console.log('lesses[0].value', lesses[0].value)

      if (
        moreOrEquals[0].value &&
        lesses[0].value &&
        parseFloat(moreOrEquals[0].value) < parseFloat(lesses[0].value)
      ) {
        return false
      }

      // Early return
      // if (betweens.length === 0 && moreOrEquals[0].value && lesses[0].value) {
      //   return parseFloat(moreOrEquals[0].value) === parseFloat(lesses[0].value)
      // }

      // Array of betweens
      const tempBetweens: number[][] = []
      betweens.forEach(answer => {
        if (answer.value) {
          tempBetweens.push(answer.value.split(',').map(parseFloat))
        }
      })

      // Sort betweens by minimal value
      tempBetweens.sort((a, b) => a[0] - b[0])

      // Check overlap
      return tempBetweens.every((between, index) => {
        if (
          index === 0 &&
          lesses[0].value &&
          between[0] !== parseFloat(lesses[0].value)
        ) {
          return false
        }
        if (
          index === tempBetweens.length - 1 &&
          moreOrEquals[0].value &&
          between[1] !== parseFloat(moreOrEquals[0].value)
        ) {
          return false
        }
        if (
          index < tempBetweens.length - 1 &&
          between[1] !== tempBetweens[index + 1][0]
        ) {
          return false
        }
        return true
      })
    }
    return false
  }
}

export const VariableService = Variable.getInstance()
