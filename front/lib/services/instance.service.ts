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
import { extractTranslation } from '@/lib/utils/string'
import { GetInstance } from '@/lib/api/modules/enhanced/instance.enhanced'

class Instance {
  private static instance: Instance

  public static getInstance(): Instance {
    if (!Instance.instance) {
      Instance.instance = new Instance()
    }

    return Instance.instance
  }

  public buildFormData = (
    instance: GetInstance,
    projectLanguageCode: string
  ): InstanceInputs => {
    return {
      duration: extractTranslation(
        instance.durationTranslations,
        projectLanguageCode
      ),
      description: extractTranslation(
        instance.descriptionTranslations,
        projectLanguageCode
      ),
      isPreReferral: instance.isPreReferral,
      positionX: instance.positionX,
      positionY: instance.positionY,
      instanceableId: instance.instanceableId,
    }
  }

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
   * Returns a Yup validation schema for the Instance object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'instances'>
  ): yup.ObjectSchema<InstanceInputs> {
    return yup.object({
      diagnosisId: yup.string(),
      instanceableId: yup.string(),
      instanceableType: yup.string().oneOf(Object.values(DiagramEnum)),
      description: yup.string().label(t('description')),
      isPreReferral: yup.boolean().test({
        name: 'exclusiveFields',
        message: t('exclusiveFields'),
        test: function (value: boolean | undefined) {
          const duration = this.parent?.duration as string
          return (value && duration === '') || (!value && duration !== '')
        },
      }),
      duration: yup.string().test({
        name: 'exclusiveFields',
        message: t('exclusiveFields'),
        test: function (value: string | undefined) {
          const isPreReferral = this.parent?.isPreReferral as boolean
          return (
            (value === '' && isPreReferral) || (value !== '' && !isPreReferral)
          )
        },
      }),
      positionX: yup.number().required(),
      positionY: yup.number().required(),
      nodeId: yup.string(),
    })
  }
}

export default Instance.getInstance()
