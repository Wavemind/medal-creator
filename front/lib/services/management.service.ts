/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import type {
  CustomTFunction,
  Languages,
  ManagementInput,
  ManagementInputs,
} from '@/types'

class Management {
  private static instance: Management

  public static getInstance(): Management {
    if (!Management.instance) {
      Management.instance = new Management()
    }

    return Management.instance
  }

  public transformData = (
    data: ManagementInputs,
    projectLanguageCode: string | undefined
  ): ManagementInput => {
    const tmpData = structuredClone(data)

    const descriptionTranslations: Languages = {}
    const labelTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''
    })

    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === projectLanguageCode && tmpData.label ? tmpData.label : ''
    })

    delete tmpData.description
    delete tmpData.label

    return {
      ...tmpData,
      descriptionTranslations,
      labelTranslations,
    }
  }

  /**
   * Returns a Yup validation schema for the Management object.
   * @param t translation function
   * @returns yupSchema
   */
  // TODO : Should we include the ones that have been omitted like isNeonat and so on ?
  public getValidationSchema(
    t: CustomTFunction<'managements'>
  ): yup.ObjectSchema<ManagementInputs> {
    return yup.object({
      label: yup.string().label(t('label')).required(),
      levelOfUrgency: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
    })
  }
}

export default Management.getInstance()
