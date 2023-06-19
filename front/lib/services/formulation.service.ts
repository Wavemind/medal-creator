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
} from '../config/constants'
import type {
  CustomTFunction,
  EditFormulationQuery,
  FormulationInputs,
  FormulationQuery,
  StringIndexType,
} from '@/types'

class Formulation {
  private static instance: Formulation

  public static getInstance(): Formulation {
    if (!Formulation.instance) {
      Formulation.instance = new Formulation()
    }

    return Formulation.instance
  }

  public buildFormData(
    data: EditFormulationQuery[],
    projectLanguageCode: string
  ): FormulationInputs[] {
    return data.map(tmpData => {
      const injectionInstructions =
        tmpData.injectionInstructionsTranslations[projectLanguageCode]
      const description = tmpData.descriptionTranslations[projectLanguageCode]
      const dispensingDescription =
        tmpData.dispensingDescriptionTranslations[projectLanguageCode]
      console.log(tmpData)
      return {
        id: tmpData.id,
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
    return data.map(tmpData => {
      const descriptionTranslations: StringIndexType = {}
      const injectionInstructionsTranslations: StringIndexType = {}
      const dispensingDescriptionTranslations: StringIndexType = {}

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

      return {
        descriptionTranslations,
        injectionInstructionsTranslations,
        dispensingDescriptionTranslations,
        formulationId: tmpData.id,
        ...tmpData,
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
  ): yup.ObjectSchema<FormulationInputs> {
    return yup.object().shape({
      id: yup.number(),
      medicationForm: yup
        .mixed<MedicationFormEnum>()
        .oneOf(Object.values(MedicationFormEnum))
        .required(),
      administrationRouteId: yup
        .number()
        .label(t('administrationRoute'))
        .required(),
      dosesPerDay: yup.number().label(t('dosesPerDay')).required(),
      byAge: yup.boolean().label(t('byAge')),
      breakable: yup
        .string()
        .label(t('breakable'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_BREAKABLE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      uniqueDose: yup
        .number()
        .label(t('uniqueDoseGeneral'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            byAge || DISPLAY_UNIQUE_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      liquidConcentration: yup
        .number()
        .label(t('liquidConcentration'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_LIQUID_CONCENTRATION.includes(medicationForm),
          then: schema => schema.required(),
        }),
      doseForm: yup
        .number()
        .label(t('doseForm'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      maximalDose: yup
        .number()
        .label(t('maximalDose'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      minimalDosePerKg: yup
        .number()
        .label(t('minimalDosePerKg'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      maximalDosePerKg: yup
        .number()
        .label(t('maximalDosePerKg'))
        .when(['byAge', 'medicationForm'], {
          is: (byAge: boolean, medicationForm: MedicationFormEnum) =>
            !byAge && DISPLAY_DOSE.includes(medicationForm),
          then: schema => schema.required(),
        }),
      description: yup.string(),
      dispensingDescription: yup.string(),
      injectionInstructions: yup.string(),
    })
  }
}

export const FormulationService = Formulation.getInstance()
