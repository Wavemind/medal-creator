/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { extractTranslation } from '@/lib/utils/string'
import type { GetAlgorithmMedalDataConfig } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import type { CustomTFunction, MedalDataInputs } from '@/types'

class MedalDataConfig {
  private static instance: MedalDataConfig

  public static getInstance(): MedalDataConfig {
    if (!MedalDataConfig.instance) {
      MedalDataConfig.instance = new MedalDataConfig()
    }

    return MedalDataConfig.instance
  }

  public buildFormData = (
    algorithm: GetAlgorithmMedalDataConfig,
    projectLanguage: string
  ): MedalDataInputs => {
    const data = []

    algorithm.medalDataConfigVariables.map(apiConfig =>
      data.push({
        id: apiConfig.id,
        label: apiConfig.label,
        apiKey: apiConfig.apiKey,
        variableId: [
          {
            label: extractTranslation(
              apiConfig.variable.labelTranslations,
              projectLanguage
            ),
            value: apiConfig.variable.id,
          },
        ],
        _destroy: false,
      })
    )

    return {
      medalDataConfigVariablesAttributes: data,
    }
  }

  // public transformData = (
  //   data: ManagementInputs,
  //   projectLanguageCode: string | undefined
  // ) => {
  //   const tmpData = structuredClone(data)

  //   const descriptionTranslations: Languages = {}
  //   const labelTranslations: Languages = {}
  //   HSTORE_LANGUAGES.forEach(language => {
  //     descriptionTranslations[language] =
  //       language === projectLanguageCode && tmpData.description
  //         ? tmpData.description
  //         : ''
  //   })

  //   HSTORE_LANGUAGES.forEach(language => {
  //     labelTranslations[language] =
  //       language === projectLanguageCode && tmpData.label ? tmpData.label : ''
  //   })

  //   delete tmpData.description
  //   delete tmpData.label

  //   return {
  //     ...tmpData,
  //     descriptionTranslations,
  //     labelTranslations,
  //   }
  // }

  /**
   * Returns a Yup validation schema for the medal data config object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'medalDataConfig'>
  ): yup.ObjectSchema<TODO> {
    return yup.object({
      medalDataAttributes: yup
        .object()
        .shape({
          label: yup.string().required(),
          apiKey: yup.string().required(),
          variableId: yup.string().required(),
        })
        .required(),
    })
  }
}

export default MedalDataConfig.getInstance()
