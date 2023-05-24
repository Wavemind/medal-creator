/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { integerRegex } from '@/lib/utils'
import {
  ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER,
  AnswerTypesEnum,
  CATEGORIES_WITHOUT_OPERATOR,
  OperatorsEnum,
} from '@/lib/config/constants'
import { CustomTFunction } from '@/types'

class Answer {
  private static instance: Answer

  public static getInstance(): Answer {
    if (!Answer.instance) {
      Answer.instance = new Answer()
    }

    return Answer.instance
  }

  public getValidationSchema(t: CustomTFunction<'variables'>) {
    return yup.object().shape({
      label: yup.string().required().label(t('answer.label')),
      value: yup
        .string()
        .label(t('answer.value')),
        // .when([], ([], schema, context) => {
        //   if (context.from) {
        //     const parentContext = context.from[1].value
        //     const { value } = context
        //     const answerType = parseInt(parentContext?.answerType)

        //     // Should have value
        //     if (!ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(answerType)) {
        //       return schema.label(t('answer.value')).required()
        //     }

        //     // Should be integer
        //     if (
        //       answerType === AnswerTypesEnum.InputInteger &&
        //       !integerRegex.test(value)
        //     ) {
        //       console.log('PAS UN INTEGER')
        //       return schema
        //         .label(t('answer.value'))
        //         .required(' doit être un entier')
        //     }

        //     // Should be float
        //     if (
        //       answerType === AnswerTypesEnum.InputFloat // &&
        //       // !floatRegex.test(value)
        //     ) {
        //       console.log('PAS UN FLOAT')
        //       return schema
        //         .label(t('answer.value'))
        //         .required('doit être un nombre à virgule')
        //     }

        //     // TODO IF ANSWER TYPE DECIMAL OR INTEGER -> CHECK IF CAN BE CAST IN FLOAT OR INT
        //     // TODO IF OPERATOR IS BETWEEN -> CHECK IF ',' IS PRESENT AND CAN BE CAST IN FLOAT OR INT
        //     console.log('OKEY')
        //     return schema
        //   }
        // }),
      operator: yup
        .mixed()
        .oneOf(Object.values(OperatorsEnum))
        // .when([], ([], schema, context) => {
        //   if (context.from) {
        //     const parentContext = context.from[1].value
        //     const answerType = parentContext?.answerType
        //     const type = parentContext?.type

        //     if (
        //       !ANSWER_TYPE_WITHOUT_OPERATOR_AND_ANSWER.includes(
        //         parseInt(answerType)
        //       ) &&
        //       !CATEGORIES_WITHOUT_OPERATOR.includes(type)
        //     ) {
        //       return schema.label(t('answer.operator')).required()
        //     }
        //   }

        //   return schema
        // }),
    })
  }
}

export const AnswerService = Answer.getInstance()
