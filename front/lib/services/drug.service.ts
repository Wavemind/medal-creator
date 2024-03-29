/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import FormulationService from '@/lib/services/formulation.service'
import { extractTranslation } from '@/lib/utils/string'
import type {
  CustomTFunction,
  DrugInput,
  DrugInputs,
  Languages,
  Scalars,
} from '@/types'
import type { EditDrug } from '@/lib/api/modules/enhanced/drug.enhanced'

class Drug {
  private static instance: Drug

  public static getInstance(): Drug {
    if (!Drug.instance) {
      Drug.instance = new Drug()
    }

    return Drug.instance
  }

  public buildFormData(
    data: EditDrug,
    projectLanguageCode: string,
    projectId: Scalars['ID']
  ): DrugInputs {
    return {
      label: extractTranslation(data.labelTranslations, projectLanguageCode),
      description: extractTranslation(
        data?.descriptionTranslations,
        projectLanguageCode
      ),
      projectId: projectId,
      isNeonat: data.isNeonat,
      isAntibiotic: data.isAntibiotic,
      isAntiMalarial: data.isAntiMalarial,
      levelOfUrgency: data.levelOfUrgency,
      formulationsAttributes: FormulationService.buildFormData(
        data.formulations,
        projectLanguageCode
      ),
    }
  }

  /**
   * Transforms the data by cloning it, performing translations, and modifying the structure to match the API
   * @param data form data
   * @param projectLanguageCode default language of project
   * @returns DrugInput
   */
  public transformData(
    data: DrugInputs,
    projectLanguageCode: string | undefined
  ): DrugInput {
    const tmpData = structuredClone(data)
    const labelTranslations: Languages = {}
    const descriptionTranslations: Languages = {}

    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === projectLanguageCode && tmpData.label ? tmpData.label : ''
      descriptionTranslations[language] =
        language === projectLanguageCode && tmpData.description
          ? tmpData.description
          : ''
    })

    const formulationsAttributes = FormulationService.transformData(
      tmpData.formulationsAttributes,
      projectLanguageCode
    )

    delete tmpData.label
    delete tmpData.description

    return {
      projectId: tmpData.projectId,
      isNeonat: tmpData.isNeonat,
      isAntibiotic: tmpData.isAntibiotic,
      isAntiMalarial: tmpData.isAntiMalarial,
      levelOfUrgency: tmpData.levelOfUrgency,
      formulationsAttributes,
      labelTranslations,
      descriptionTranslations,
    }
  }

  /**
   * Returns a Yup validation schema for the drug object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'drugs'>
  ): yup.ObjectSchema<DrugInputs> {
    return yup.object({
      projectId: yup.string().required(),
      label: yup.string().default('').label(t('label')).required(),
      description: yup.string().label(t('description')),
      isNeonat: yup.boolean().default(false).label(t('isNeonat')),
      isAntiMalarial: yup.boolean().default(false).label(t('isAntiMalarial')),
      isAntibiotic: yup.boolean().default(false).label(t('isAntibiotic')),
      levelOfUrgency: yup.number().default(5),
      formulationsAttributes: yup
        .array()
        .of(FormulationService.getValidationSchema(t))
        .label(t('stepper.formulations'))
        .min(1)
        .required(),
    })
  }
}

export default Drug.getInstance()
