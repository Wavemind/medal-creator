/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import type {
  DiagnosisInput,
  DiagnosisInputs,
  CustomTFunction,
  Languages,
} from '@/types'

class Diagnosis {
  private static instance: Diagnosis

  public static getInstance(): Diagnosis {
    if (!Diagnosis.instance) {
      Diagnosis.instance = new Diagnosis()
    }

    return Diagnosis.instance
  }

  public transformData = (
    data: DiagnosisInputs,
    projectLanguageCode: string | undefined
  ): DiagnosisInput => {
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
   * Returns a Yup validation schema for the algorithm object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'diagnosis'>
  ): yup.ObjectSchema<DiagnosisInputs> {
    return yup.object({
      label: yup.string().label(t('label')).required(),
      description: yup.string().label(t('description')),
      levelOfUrgency: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
    })
  }
}

export default Diagnosis.getInstance()
