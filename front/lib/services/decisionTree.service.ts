/**
 * The external imports
 */
import * as yup from 'yup'

/**
 * The internal imports
 */
import { HSTORE_LANGUAGES } from '@/lib/config/constants'
import { extractTranslation } from '@/lib/utils/string'
import { CutOffValueTypesEnum } from '@/types'
import type {
  DecisionTreeInput,
  DecisionTreeInputs,
  CustomTFunction,
  Languages,
} from '@/types'
import type { GetDecisionTree } from '@/lib/api/modules/enhanced/decisionTree.enhanced'

class DecisionTree {
  private static instance: DecisionTree

  public static getInstance(): DecisionTree {
    if (!DecisionTree.instance) {
      DecisionTree.instance = new DecisionTree()
    }

    return DecisionTree.instance
  }

  public buildFormData = (
    decisionTree: GetDecisionTree,
    projectLanguageCode: string
  ): DecisionTreeInputs => {
    return {
      label: extractTranslation(
        decisionTree.labelTranslations,
        projectLanguageCode
      ),
      nodeId: decisionTree.node.id,
      cutOffStart: decisionTree.cutOffStart,
      cutOffEnd: decisionTree.cutOffEnd,
      cutOffValueType: CutOffValueTypesEnum.Days,
    }
  }

  public transformData = (
    data: DecisionTreeInputs,
    projectLanguageCode: string | undefined
  ): DecisionTreeInput => {
    const tmpData = structuredClone(data)
    const labelTranslations: Languages = {}
    HSTORE_LANGUAGES.forEach(language => {
      labelTranslations[language] =
        language === projectLanguageCode && tmpData.label ? tmpData.label : ''
    })
    delete tmpData.label

    if (!tmpData.cutOffStart) {
      delete tmpData.cutOffStart
    }

    if (!tmpData.cutOffEnd) {
      delete tmpData.cutOffEnd
    }

    return {
      ...tmpData,
      labelTranslations,
    }
  }

  /**
   * Returns a Yup validation schema for the algorithm object.
   * @param t translation function
   * @returns yupSchema
   */
  public getValidationSchema(
    t: CustomTFunction<'decisionTrees'>
  ): yup.ObjectSchema<DecisionTreeInputs> {
    return yup.object({
      label: yup.string().label(t('label')).required(),
      nodeId: yup.string().label(t('complaintCategory')).required(),
      cutOffStart: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
      cutOffEnd: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .nullable(),
      cutOffValueType: yup
        .mixed<CutOffValueTypesEnum>()
        .oneOf(Object.values(CutOffValueTypesEnum))
        .label(t('cutOffValueType'))
        .required(),
    })
  }
}

export default DecisionTree.getInstance()
