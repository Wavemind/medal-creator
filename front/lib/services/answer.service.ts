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
import type validations from '@/public/locales/en/validations.json'

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
    let existingAnswers: DefaultAnswerProps[] = []
    if (answers) {
      existingAnswers = answers.map(answer =>
        this.buildAnswer(answer, projectLanguageCode)
      )
    }
    return existingAnswers
  }

  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object().shape({
      label: yup.string().required().label(t('answer.label')),
      value: yup
        .string()
        .nullable()
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
        .nullable()
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

  public validateOverlap(answers: DefaultAnswerProps[] | undefined): {
    isOverlapValid: boolean
    message?: keyof typeof validations.overlap
  } {
    if (answers) {
      // Only one more or equal
      const moreOrEquals = answers.filter(
        answer =>
          answer.operator === OperatorsEnum.MoreOrEqual && !answer._destroy
      )

      const lesses = answers.filter(
        answer => answer.operator === OperatorsEnum.Less && !answer._destroy
      )

      const betweens = answers.filter(
        answer => answer.operator === OperatorsEnum.Between && !answer._destroy
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

  private buildAnswer = (
    answer: AnswerType,
    projectLanguageCode: string
  ): DefaultAnswerProps => {
    if (answer.operator === OperatorsEnum.Between && answer.value) {
      const splittedValue = answer.value.split(',')
      return {
        answerId: answer.id,
        label: answer.labelTranslations[projectLanguageCode],
        operator: answer.operator,
        startValue: splittedValue[0],
        endValue: splittedValue[1],
      }
    } else {
      return {
        answerId: answer.id,
        label: answer.labelTranslations[projectLanguageCode],
        operator: answer.operator,
        value: answer.value,
      }
    }
  }
}

export const AnswerService = Answer.getInstance()
