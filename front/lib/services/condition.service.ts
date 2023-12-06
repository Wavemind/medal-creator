/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { CutOffValueTypesEnum } from '@/types'
import type { GetCondition } from '@/lib/api/modules/enhanced/condition.enhanced'
import type { CustomTFunction, ConditionInputs, ScoreInputs } from '@/types'

class Condition {
  private static instance: Condition

  public static getInstance(): Condition {
    if (!Condition.instance) {
      Condition.instance = new Condition()
    }

    return Condition.instance
  }

  public buildFormData = (condition: GetCondition): ConditionInputs => {
    return {
      cutOffStart: condition?.cutOffStart,
      cutOffEnd: condition?.cutOffEnd,
      cutOffValueType: CutOffValueTypesEnum.Days,
    }
  }

  public buildScoreFormData = (condition: GetCondition): ScoreInputs => {
    return {
      score: condition?.score,
    }
  }

  /**
   * Returns a Yup validation schema for the condition object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'decisionTrees'>
  ): yup.ObjectSchema<ConditionInputs> {
    return yup.object({
      cutOffStart: yup
        .number()
        .label(t('cutOffStart'))
        .transform(value => (isNaN(value) ? null : value))
        .nullable(),
      cutOffEnd: yup
        .number()
        .label(t('cutOffEnd'))
        .moreThan(yup.ref('cutOffStart'))
        .transform(value => (isNaN(value) ? null : value))
        .nullable(),
      cutOffValueType: yup
        .mixed<CutOffValueTypesEnum>()
        .oneOf(Object.values(CutOffValueTypesEnum))
        .label(t('cutOffValueType'))
        .required(),
    })
  }

  public getScoreValidationSchema(
    t: CustomTFunction<'questionsSequence'>
  ): yup.ObjectSchema<ScoreInputs> {
    return yup.object({
      score: yup
        .number()
        .label(t('score'))
        .transform(value => (isNaN(value) ? null : value))
        .required(),
    })
  }
}

export default Condition.getInstance()
