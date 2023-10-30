/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import {
  DISPLAY_BREAKABLE,
  DISPLAY_DOSE,
  DISPLAY_LIQUID_CONCENTRATION,
  DISPLAY_UNIQUE_DOSE,
  HSTORE_LANGUAGES,
  MedicationFormEnum,
} from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import type {
  CustomTFunction,
  FormulationInputs,
  FormulationQuery,
  Languages,
} from '@/types'
import type { EditDrug } from '@/lib/api/modules/enhanced/drug.enhanced'

class Formulation {
  private static instance: Formulation

  public static getInstance(): Formulation {
    if (!Formulation.instance) {
      Formulation.instance = new Formulation()
    }

    return Formulation.instance
  }

  public buildFormData(
    data: EditDrug['formulations'],
    projectLanguageCode: string
  ): FormulationInputs[] {
    return data.map(currentData => {
      const tmpData = structuredClone(currentData)

      const injectionInstructions = extractTranslation(
        tmpData.injectionInstructionsTranslations,
        projectLanguageCode
      )
      const description = extractTranslation(
        tmpData.descriptionTranslations,
        projectLanguageCode
      )
      const dispensingDescription = extractTranslation(
        tmpData.dispensingDescriptionTranslations,
        projectLanguageCode
      )

      return {
        formulationId: tmpData.id,
        medicationForm: tmpData.medicationForm,
        administrationRouteId: tmpData.administrationRoute.id,
        maximalDose: tmpData.maximalDose,
        minimalDosePerKg: tmpData.minimalDosePerKg,
        maximalDosePerKg: tmpData.maximalDosePerKg,
        doseForm: tmpData.doseForm,
        liquidConcentration: tmpData.liquidConcentration,
        dosesPerDay: tmpData.dosesPerDay,
        uniqueDose: tmpData.uniqueDose,
        breakable: tmpData.breakable,
        byAge: tmpData.byAge,
        description,
        injectionInstructions,
        dispensingDescription,
      }
    })
  }

  public transformData(
    data: FormulationInputs[],
    projectLanguageCode: string | undefined
  ): FormulationQuery[] {
    return data.map(currentData => {
      const tmpData = structuredClone(currentData)
      const currentId = tmpData.formulationId
      const descriptionTranslations: Languages = {}
      const injectionInstructionsTranslations: Languages = {}
      const dispensingDescriptionTranslations: Languages = {}

      HSTORE_LANGUAGES.forEach(language => {
        injectionInstructionsTranslations[language] =
          language === projectLanguageCode && tmpData.injectionInstructions
            ? tmpData.injectionInstructions
            : ''
        descriptionTranslations[language] =
          language === projectLanguageCode && tmpData.description
            ? tmpData.description
            : ''
        dispensingDescriptionTranslations[language] =
          language === projectLanguageCode && tmpData.dispensingDescription
            ? tmpData.dispensingDescription
            : ''
      })

      delete tmpData.description
      delete tmpData.injectionInstructions
      delete tmpData.dispensingDescription
      delete tmpData.dispensingDescription
      delete tmpData.formulationId

      return {
        ...tmpData,
        id: currentId,
        descriptionTranslations,
        injectionInstructionsTranslations,
        dispensingDescriptionTranslations,
      }
    })
  }

  /**
   * Returns a Yup validation schema for the formulation object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'formulations'>
  ): yup.ObjectSchema<Omit<FormulationInputs, 'id' | 'formulationId'>> {
    return yup.object().shape({
      administrationRouteId: yup
        .string()
        .label(t('administrationRoute', { ns: 'formulations' }))
        .required(),
      dosesPerDay: yup
        .number()
        .label(t('dosesPerDay', { ns: 'formulations' }))
        .required(),
      byAge: yup.boolean().label(t('byAge', { ns: 'formulations' })),
      breakable: yup
        .string()
        .label(t('breakable', { ns: 'formulations' }))
        .nullable()
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_BREAKABLE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      uniqueDose: yup
        .number()
        .nullable()
        .label(t('uniqueDoseGeneral', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            byAge || DISPLAY_UNIQUE_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      liquidConcentration: yup
        .number()
        .nullable()
        .label(t('liquidConcentration', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_LIQUID_CONCENTRATION.includes(medicationForm),
          then: schema => schema.required(),
        }),
      doseForm: yup
        .number()
        .nullable()
        .label(t('doseForm', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      maximalDose: yup
        .number()
        .nullable()
        .label(t('maximalDose', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      minimalDosePerKg: yup
        .number()
        .nullable()
        .label(t('minimalDosePerKg', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema =>
            schema
              .required()
              .max(
                yup.ref('maximalDosePerKg'),
                t('formulations.lessThanMaximaDosePerKg', { ns: 'validations' })
              ),
        }),
      maximalDosePerKg: yup
        .number()
        .nullable()
        .label(t('maximalDosePerKg', { ns: 'formulations' }))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema =>
            schema.required().max(
              yup.ref('maximalDose'),
              t('formulations.lessThanMaximalDailyDose', {
                ns: 'validations',
              })
            ),
        }),
      injectionInstructions: yup.string(),
      description: yup.string(),
      dispensingDescription: yup.string(),
      medicationForm: yup
        .mixed<MedicationFormEnum>()
        .oneOf(Object.values(MedicationFormEnum))
        .required(),
      formulationId: yup.number(),
      _destroy: yup.boolean(),
    })
  }
}

export default Formulation.getInstance()
