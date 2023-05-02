/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import { VariableTypesEnum } from '../config/constants'

class Variable {
  private static instance: Variable
  readonly categoriesDisablingAnswerType = [
    VariableTypesEnum.ComplaintCategory,
    VariableTypesEnum.BackgroundCalculation,
    VariableTypesEnum.BasicMeasurement,
    VariableTypesEnum.Vaccine,
    VariableTypesEnum.VitalSignAnthropometric,
  ]
  readonly categoriesDisplayingSystem = [
    VariableTypesEnum.ChronicCondition,
    VariableTypesEnum.Exposure,
    VariableTypesEnum.ObservedPhysicalSign,
    VariableTypesEnum.PhysicalExam,
    VariableTypesEnum.Symptom,
    VariableTypesEnum.Vaccine,
    VariableTypesEnum.VitalSignAnthropometric,
  ]
  readonly categoriesWithoutStage = [VariableTypesEnum.BackgroundCalculation]
  readonly categoriesWithoutAnswers = [
    VariableTypesEnum.VitalSignAnthropometric,
    VariableTypesEnum.BasicMeasurement,
    VariableTypesEnum.BasicDemographic,
  ]
  readonly categoriesDisplayingEstimableOption = [
    VariableTypesEnum.BasicMeasurement,
  ]
  readonly categoriesDisplayingUnavailableOption = [
    VariableTypesEnum.AssessmentTest,
    VariableTypesEnum.BasicMeasurement,
    VariableTypesEnum.ChronicCondition,
    VariableTypesEnum.Exposure,
    VariableTypesEnum.PhysicalExam,
    VariableTypesEnum.Symptom,
    VariableTypesEnum.Vaccine,
    VariableTypesEnum.VitalSignAnthropometric,
  ]
  readonly categoriesWithoutOperator = [
    VariableTypesEnum.BasicMeasurement,
    VariableTypesEnum.VitalSignAnthropometric,
  ]
  readonly categoriesDisplayingPreFill = [
    VariableTypesEnum.BasicDemographic,
    VariableTypesEnum.Demographic,
  ]

  public static getInstance(): Variable {
    if (!Variable.instance) {
      Variable.instance = new Variable()
    }

    return Variable.instance
  }

  public extractCategoryKey(category: string): string {
    const prefix = 'Variables::'
    const key = category
    if (key.startsWith(prefix)) {
      return camelize(key.slice(prefix.length))
    }
    return key
  }
}

export const VariableService = Variable.getInstance()
