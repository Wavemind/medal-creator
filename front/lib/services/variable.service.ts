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
  OperatorsEnum,
  RoundsEnum,
  StagesEnum,
  VariableTypesEnum,
} from '@/lib/config/constants'
import { AnswerService } from '@/lib/services'
import { CustomTFunction } from '@/types'

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

  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object({
      answerType: yup.string().trim().label('answerType').required(),
      answersAttributes: yup
        .array()
        .of(AnswerService.getValidationSchema(t))
        .test(
          'overlap',
          () => 'marche pas',
          answers => {
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
              if (moreOrEquals.length !== 1 || lesses.length !== 1) {
                return false
              }

              if (
                moreOrEquals[0].value &&
                lesses[0].value &&
                parseFloat(moreOrEquals[0].value) < parseFloat(lesses[0].value)
              ) {
                return false
              }

              // Early return
              if (
                betweens.length === 0 &&
                moreOrEquals[0].value &&
                lesses[0].value
              ) {
                return (
                  parseFloat(moreOrEquals[0].value) ===
                  parseFloat(lesses[0].value)
                )
              }

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
        ),
      description: yup.string().label(t('description')),
      isEstimable: yup.boolean().label(t('isEstimable')),
      emergencyStatus: yup
        .mixed()
        .oneOf(Object.values(EmergencyStatusesEnum))
        .label(t('emergencyStatus')),
      formula: yup.string().when('answerType', {
        is: (answerType: string) =>
          parseInt(answerType) === AnswerTypesEnum.FormulaFloat,
        then: () => yup.string().label(t('formula')).required(),
      }),
      isMandatory: yup.boolean().label(t('isMandatory')),
      isIdentifiable: yup.boolean().label(t('isIdentifiable')),
      isPreFill: yup.boolean().label(t('isPreFill')),
      isNeonat: yup.boolean().label(t('isNeonat')),
      label: yup.string().label(t('label')).required(),
      maxMessageError: yup.string().label(t('maxMessageError')),
      maxMessageWarning: yup.string().label(t('maxMessageWarning')),
      maxValueError: yup.number().label(t('maxValueError')),
      maxValueWarning: yup.number().label(t('maxValueWarning')),
      minValueError: yup.number().label(t('minValueError')),
      minValueWarning: yup.number().label(t('minValueWarning')),
      minMessageError: yup.string().label(t('minMessageError')),
      minMessageWarning: yup.string().label(t('minMessageWarning')),
      placeholder: yup.string().label(t('placeholder')),
      round: yup.mixed().oneOf(Object.values(RoundsEnum)).label(t('round')),
      system: yup.string().when('type', {
        is: (type: VariableTypesEnum) =>
          CATEGORIES_DISPLAYING_SYSTEM.includes(type),
        then: () => yup.string().label(t('system')).required(),
      }),
      stage: yup.string().when('type', {
        is: (type: VariableTypesEnum) =>
          !CATEGORIES_WITHOUT_STAGE.includes(type),
        then: () => yup.string().label(t('stage')).required(),
      }),
      type: yup
        .mixed()
        .oneOf(Object.values(VariableTypesEnum))
        .label(t('type'))
        .required(),
      isUnavailable: yup.boolean().label(t('isUnavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
    })
  }
}

export const VariableService = Variable.getInstance()
