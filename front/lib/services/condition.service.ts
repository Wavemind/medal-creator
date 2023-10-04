/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { CutOffValueTypes } from '@/types'
import type { CustomTFunction, ConditionInputs } from '@/types'

class Condition {
  private static instance: Condition

  public static getInstance(): Condition {
    if (!Condition.instance) {
      Condition.instance = new Condition()
    }

    return Condition.instance
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
        .mixed<CutOffValueTypes>()
        .oneOf(Object.values(CutOffValueTypes))
        .label(t('cutOffValueType'))
        .required(),
    })
  }
}

export default Condition.getInstance()
