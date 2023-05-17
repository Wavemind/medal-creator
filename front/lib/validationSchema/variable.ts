/**
 * The external imports
 */
import * as yup from 'yup'
import { i18n } from 'next-i18next'

/**
 * The internal imports
 */
import {
  AnswerTypesEnum,
  CATEGORIES_DISPLAYING_SYSTEM,
  CATEGORIES_WITHOUT_STAGE,
  EmergencyStatusesEnum,
  OperatorsEnum,
  RoundsEnum,
  VariableTypesEnum,
} from '../config/constants'
import { AnswerSchema } from './answer'

export const VariableSchema = yup.object({
  answerType: yup.string().trim().label('answerType').required(),
  answersAttributes: yup
    .array()
    .of(AnswerSchema)
    .test(
      'overlap',
      ({ label }) => 'marche pas',
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

          if (parseFloat(moreOrEquals[0].value) < parseFloat(lesses[0].value)) {
            return false
          }

          // Early return
          if (betweens.length === 0) {
            return (
              parseFloat(moreOrEquals[0].value) === parseFloat(lesses[0].value)
            )
          }

          // Array of betweens
          const tempBetweens: number[][] = []
          betweens.forEach(answer => {
            tempBetweens.push(answer.value.split(',').map(parseFloat))
          })

          // Sort betweens by minimal value
          tempBetweens.sort((a, b) => a[0] - b[0])

          // Check overlap
          return tempBetweens.every((between, index) => {
            if (index === 0 && between[0] !== parseFloat(lesses[0].value)) {
              return false
            }

            if (
              index === tempBetweens.length - 1 &&
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
  description: yup.string().label(i18n?.t('description')),
  isEstimable: yup.boolean().label(i18n?.t('isEstimable')),
  emergencyStatus: yup
    .mixed()
    .oneOf(Object.values(EmergencyStatusesEnum))
    .label(i18n?.t('emergencyStatus')),
  formula: yup.string().when('answerType', {
    is: (answerType: string) =>
      parseInt(answerType) === AnswerTypesEnum.FormulaFloat,
    then: () => yup.string().label(i18n?.t('formula')).required(),
  }),
  isMandatory: yup.boolean().label(i18n?.t('isMandatory')),
  isIdentifiable: yup.boolean().label(i18n?.t('isIdentifiable')),
  isPreFill: yup.boolean().label(i18n?.t('isPreFill')),
  isNeonat: yup.boolean().label(i18n?.t('isNeonat')),
  label: yup.string().label(i18n?.t('label')).required(),
  maxMessageError: yup.string().label(i18n?.t('maxMessageError')),
  maxMessageWarning: yup.string().label(i18n?.t('maxMessageWarning')),
  maxValueError: yup.number().label(i18n?.t('maxValueError')),
  maxValueWarning: yup.number().label(i18n?.t('maxValueWarning')),
  minValueError: yup.number().label(i18n?.t('minValueError')),
  minValueWarning: yup.number().label(i18n?.t('minValueWarning')),
  minMessageError: yup.string().label(i18n?.t('minMessageError')),
  minMessageWarning: yup.string().label(i18n?.t('minMessageWarning')),
  placeholder: yup.string().label(i18n?.t('placeholder')),
  round: yup.mixed().oneOf(Object.values(RoundsEnum)).label(i18n?.t('round')),
  system: yup.string().when('type', {
    is: (type: VariableTypesEnum) =>
      CATEGORIES_DISPLAYING_SYSTEM.includes(type),
    then: () => yup.string().label(i18n?.t('system')).required(),
  }),
  stage: yup.string().when('type', {
    is: (type: VariableTypesEnum) => !CATEGORIES_WITHOUT_STAGE.includes(type),
    then: () => yup.string().label(i18n?.t('stage')).required(),
  }),
  type: yup
    .mixed()
    .oneOf(Object.values(VariableTypesEnum))
    .label(i18n?.t('type'))
    .required(),
  isUnavailable: yup.boolean().label(i18n?.t('isUnavailable.unavailable')), // CONDITIONAL LABEL DISPLAY
})
