/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import type {
  AlgorithmInput,
  AlgorithmInputs,
  CustomTFunction,
  Languages,
} from '@/types'
import type { GetAlgorithm } from '@/lib/api/modules/enhanced/algorithm.enhanced'

class Algorithm {
  private static instance: Algorithm

  public static getInstance(): Algorithm {
    if (!Algorithm.instance) {
      Algorithm.instance = new Algorithm()
    }

    return Algorithm.instance
  }

  public buildFormData = (
    algorithm: GetAlgorithm,
    projectLanguageCode: string
  ): AlgorithmInputs => {
    return {
      name: algorithm.name,
      description: extractTranslation(
        algorithm.descriptionTranslations,
        projectLanguageCode
      ),
      ageLimitMessage: extractTranslation(
        algorithm.ageLimitMessageTranslations,
        projectLanguageCode
      ),
      mode: algorithm.mode,
      ageLimit: algorithm.ageLimit,
      minimumAge: algorithm.minimumAge,
      languageIds: algorithm.languages.map(language => language.id),
    }
  }

  public transformData = (
    data: AlgorithmInputs,
    projectLanguageCode: string | undefined
  ): AlgorithmInput => {
    const tmpData = structuredClone(data)
    const descriptionTranslations: Languages = {}
    const ageLimitMessageTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''
      ageLimitMessageTranslations[language] =
        language === projectLanguageCode && tmpData.ageLimitMessage
          ? tmpData.ageLimitMessage
          : ''
    })

    delete tmpData.description
    delete tmpData.ageLimitMessage

    return {
      ...tmpData,
      descriptionTranslations,
      ageLimitMessageTranslations,
    }
  }

  public getValidationSchema(
    t: CustomTFunction<'algorithms'>
  ): yup.ObjectSchema<
    Omit<
      AlgorithmInputs,
      'fullOrderJson' | 'languageIds' | 'medalDataConfigVariablesAttributes'
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
