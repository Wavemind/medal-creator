/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import {
  DiagramEnum,
  type CustomTFunction,
  type InstanceInputs,
  type Languages,
} from '@/types'
import { GetManagement } from '@/lib/api/modules/enhanced/management.enhanced'
import { extractTranslation } from '@/lib/utils/string'

class Instance {
  private static instance: Instance

  public static getInstance(): Instance {
    if (!Instance.instance) {
      Instance.instance = new Instance()
    }

    return Instance.instance
  }

  // public buildFormData = (
  //   management: GetManagement,
  //   projectLanguageCode: string
  // ): ManagementInputs => {
  //   return {
  //     label: extractTranslation(
  //       management.labelTranslations,
  //       projectLanguageCode
  //     ),
  //     description: extractTranslation(
  //       management.descriptionTranslations,
  //       projectLanguageCode
  //     ),
  //     levelOfUrgency: management.levelOfUrgency,
  //     isReferral: management.isReferral,
  //     isNeonat: management.isNeonat,
  //   }
  // }

  public transformData = (
    data: InstanceInputs,
    projectLanguageCode: string | undefined
  ) => {
    const tmpData = structuredClone(data)

    const descriptionTranslations: Languages = {}
    const durationTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''
    })

    HSTORE_LANGUAGES.forEach(language => {
      durationTranslations[language] =
        language === projectLanguageCode && tmpData.duration
          ? tmpData.duration
          : ''
    })

    delete tmpData.description
    delete tmpData.duration

    return {
      ...tmpData,
      descriptionTranslations,
      durationTranslations,
    }
  }

  /**
   * Returns a Yup validation schema for the Management object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'instances'>
  ): yup.ObjectSchema<InstanceInputs> {
    return yup.object({
      diagnosisId: yup.string(),
      instanceableId: yup.string().required(),
      instanceableType: yup.string().oneOf(Object.values(DiagramEnum)),
      duration: yup.string().required().label(t('label')),
      description: yup.string().label(t('description')),
      isPreReferral: yup.boolean().label('isReferral'),
      positionX: yup.number().required(),
      positionY: yup.number().required(),
      nodeId: yup.string().required(),
    })
  }
}

export default Instance.getInstance()
