/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { extractTranslation } from '@/lib/utils/string'
import type { GetAlgorithmMedalDataConfig } from '@/lib/api/modules/enhanced/algorithm.enhanced'
import type {
  AlgorithmInput,
  CustomTFunction,
  MedalDataConfigVariableInputs,
} from '@/types'

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
  ): MedalDataConfigVariableInputs => {
    const data = algorithm.medalDataConfigVariables.map(apiConfig => ({
      medalDataConfigId: apiConfig.id,
      label: apiConfig.label,
      apiKey: apiConfig.apiKey,
      variableValue: {
        label: extractTranslation(
          apiConfig.variable.labelTranslations,
          projectLanguage
        ),
        value: apiConfig.variable.id,
      },
      _destroy: false,
    }))

    return {
      medalDataConfigVariablesAttributes: data,
    }
  }

  public transformData = (
    data: MedalDataConfigVariableInputs
  ): Pick<AlgorithmInput, 'medalDataConfigVariablesAttributes'> => {
    const tmpData = structuredClone(data.medalDataConfigVariablesAttributes)

    const newMedalDataConfigVariables = tmpData.map(apiConfig => ({
      id: apiConfig.medalDataConfigId,
      label: apiConfig.label,
      apiKey: apiConfig.apiKey,
      variableId: apiConfig.variableValue.value,
      _destroy: apiConfig._destroy,
    }))

    return {
      medalDataConfigVariablesAttributes: newMedalDataConfigVariables,
    }
  }

  /**
   * Returns a Yup validation schema for the medal data config object.
   * @param t translation function
   * @returns yupSchema
   */
  // TODO: Finish it
  public getValidationSchema(
    t: CustomTFunction<'medalDataConfig'>
  ): yup.ObjectSchema<MedalDataConfigVariableInputs> {
    return yup.object({
      medalDataConfigVariablesAttributes: yup
        .object()
        .shape({
          label: yup.string().required(),
          apiKey: yup.string().required(),
          variableValue: yup
            .object()
            .shape({
              label: yup.string().required(),
              value: yup.string().required(),
            })
            .required(),
        })
        .required(),
    })
  }
}

export default MedalDataConfig.getInstance()
