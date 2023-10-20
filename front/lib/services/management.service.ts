/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import type { CustomTFunction, Languages, ManagementInputs } from '@/types'
import { GetManagement } from '@/lib/api/modules/enhanced/management.enhanced'
import { extractTranslation } from '@/lib/utils/string'

class Management {
  private static instance: Management

  public static getInstance(): Management {
    if (!Management.instance) {
      Management.instance = new Management()
    }

    return Management.instance
  }

  public buildFormData = (
    management: GetManagement,
    projectLanguageCode: string
  ): ManagementInputs => {
    return {
      label: extractTranslation(
        management.labelTranslations,
        projectLanguageCode
      ),
      description: extractTranslation(
        management.descriptionTranslations,
        projectLanguageCode
      ),
      levelOfUrgency: management.levelOfUrgency,
      isReferral: management.isReferral,
      isNeonat: management.isNeonat,
    }
  }

  public transformData = (
    data: ManagementInputs,
    projectLanguageCode: string | undefined
  ) => {
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
  public getValidationSchema(
    t: CustomTFunction<'managements'>
  ): yup.ObjectSchema<ManagementInputs> {
    return yup.object({
      projectId: yup.string().required(),
      label: yup.string().label(t('label')).required(),
      description: yup.string().label(t('description')),
      isNeonat: yup.boolean().label(t('isNeonat')),
      isReferral: yup.boolean().label(t('isReferral')),
      levelOfUrgency: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value)),
    })
  }
}

export default Management.getInstance()
