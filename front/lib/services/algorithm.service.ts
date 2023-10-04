/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import type { AlgorithmInputs, CustomTFunction } from '@/types'

class Algorithm {
  private static instance: Algorithm

  public static getInstance(): Algorithm {
    if (!Algorithm.instance) {
      Algorithm.instance = new Algorithm()
    }

    return Algorithm.instance
  }

  /**
   * Returns a Yup validation schema for the algorithm object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'algorithms'>
  ): yup.ObjectSchema<
    Omit<
      AlgorithmInputs,
      | 'fullOrderJson'
      | 'status'
      | 'languageIds'
      | 'medalDataConfigVariablesAttributes'
    >
  > {
    return yup.object({
      name: yup.string().label(t('name')).required(),
      ageLimit: yup.number().label(t('ageLimit')).required(),
      ageLimitMessage: yup.string().label(t('ageLimitMessage')).required(),
      minimumAge: yup
        .number()
        .label(t('minimumAge'))
        .required()
        .when('ageLimit', ([ageLimit]: Array<number>, schema, context) =>
          ageLimit * 365 < context.parent.minimumAge
            ? schema.lessThan(ageLimit * 365)
            : schema
        ),
      mode: yup.string().label(t('mode')).required(),
      description: yup.string().label(t('description')).required(),
    })
  }
}

export default Algorithm.getInstance()
