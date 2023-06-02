/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  CATEGORIES_WITHOUT_OPERATOR,
  OperatorsEnum,
} from '@/lib/config/constants'
import {
  DefaultAnswerProps,
  CustomTFunction,
  Answer as AnswerType,
} from '@/types'

class Answer {
  private static instance: Answer

  public static getInstance(): Answer {
    if (!Answer.instance) {
      Answer.instance = new Answer()
    }

    return Answer.instance
  }

  public buildExistingAnswers = (
    answers: AnswerType[],
    projectLanguageCode: string
  ): DefaultAnswerProps[] => {
    const existingAnswers: DefaultAnswerProps[] = []
    if (answers) {
      answers.forEach(answer => {
        console.log(answer.value)
        // TODO HOW WE DEAL WITH NOT_AVAILABLE
        if (answer.operator === OperatorsEnum.Between && answer.value) {
          const splittedValue = answer.value.split(',')
          existingAnswers.push({
            answerId: answer.id,
            label: answer.labelTranslations[projectLanguageCode],
            operator: answer.operator,
            startValue: splittedValue[0],
            endValue: splittedValue[1],
          })
        } else {
          existingAnswers.push({
            answerId: answer.id,
            label: answer.labelTranslations[projectLanguageCode],
            operator: answer.operator,
            value: answer.value,
          })
        }
      })
    }
    return existingAnswers
  }

  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object().shape({
      label: yup.string().required().label(t('answer.label')),
      value: yup
        .string()
        .label(t('answer.value'))
        .test('validate', (value, testContext) => {
          if (testContext.from) {
            const parentContext = testContext.from[1].value
            const answerType = parseInt(parentContext.answerType)

            // No validation needed for ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER members
            // OR if operator is 'Between' because we replace 'value' with 'startValue' and 'endValue'
            if (
              ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerType) ||
              testContext.parent.operator === OperatorsEnum.Between
            ) {
              return true
            }

            // Validation for no value (undefined || '')
            if (!value) {
              return testContext.createError({
                message: t('required', { ns: 'validations' }),
              })
            }

            return true
          }
        }),
      startValue: yup
        .string()
        .label(t('answer.startValue'))
        .test('validate', (value, testContext) => {
          if (testContext.from) {
            const parentContext = testContext.from[1].value
            const answerType = parseInt(parentContext.answerType)

            // No validation needed for ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER members
            // OR if operator is not 'Between' because we replace 'startValue' and 'endValue' with 'value'
            if (
              ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerType) ||
              testContext.parent.operator !== OperatorsEnum.Between
            ) {
              return true
            }

            // Validation for no value (undefined || '')
            if (!value) {
              return testContext.createError({
                message: t('required', { ns: 'validations' }),
              })
            }

            return true
          }
        }),
      endValue: yup
        .string()
        .label(t('answer.endValue'))
        .test('validate', (value, testContext) => {
          if (testContext.from) {
            const parentContext = testContext.from[1].value
            const answerType = parseInt(parentContext.answerType)

            // No validation needed for ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER members
            // OR if operator is not 'Between' because we replace 'startValue' and 'endValue' with 'value'
            if (
              ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerType) ||
              testContext.parent.operator !== OperatorsEnum.Between
            ) {
              return true
            }

            // Validation for no value (undefined || '')
            if (!value) {
              return testContext.createError({
                message: t('required', { ns: 'validations' }),
              })
            }

            return true
          }
        }),
      operator: yup
        .mixed()
        .oneOf(Object.values(OperatorsEnum))
        .label(t('answer.operator'))
        .test(
          'required',
          t('required', { ns: 'validations' }),
          (value, testContext) => {
            if (testContext.from) {
              const parentContext = testContext.from[1].value
              const answerType = parentContext?.answerType
              const type = parentContext?.type

              if (
                !ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(
                  parseInt(answerType)
                ) &&
                !CATEGORIES_WITHOUT_OPERATOR.includes(type) &&
                !value
              ) {
                return false
              }
            }

            return true
          }
        ),
    })
  }
}

export const AnswerService = Answer.getInstance()
