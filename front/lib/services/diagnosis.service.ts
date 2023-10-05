/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import type { DiagnosisInputs, CustomTFunction, Languages } from '@/types'
import type { GetDiagnosis } from '@/lib/api/modules/enhanced/diagnosis.enhanced'

class Diagnosis {
  private static instance: Diagnosis

  public static getInstance(): Diagnosis {
    if (!Diagnosis.instance) {
      Diagnosis.instance = new Diagnosis()
    }

    return Diagnosis.instance
  }

  public buildFormData = (
    diagnosis: GetDiagnosis,
    projectLanguageCode: string
  ): DiagnosisInputs => {
    return {
      label: extractTranslation(
        diagnosis.labelTranslations,
        projectLanguageCode
      ),
      description: extractTranslation(
        diagnosis.descriptionTranslations,
        projectLanguageCode
      ),
      levelOfUrgency: diagnosis.levelOfUrgency,
    }
  }

  public transformData = (
    data: DiagnosisInputs,
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
