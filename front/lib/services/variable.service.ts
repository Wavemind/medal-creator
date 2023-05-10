/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import {
  EmergencyStatusesEnum,
  RoundsEnum,
  StagesEnum,
  VariableTypesEnum,
} from '../config/constants'

class Variable {
  private static instance: Variable
  categories: Array<VariableTypesEnum>
  stages: Array<StagesEnum>
  emergencyStatuses: Array<EmergencyStatusesEnum>
  rounds: Array<RoundsEnum>

  constructor() {
    this.categories = Object.values(VariableTypesEnum)
    this.stages = Object.values(StagesEnum)
    this.emergencyStatuses = Object.values(EmergencyStatusesEnum)
    this.rounds = Object.values(RoundsEnum)
  }

  public static getInstance(): Variable {
    if (!Variable.instance) {
      Variable.instance = new Variable()
    }

    return Variable.instance
  }

  public extractCategoryKey(category: VariableTypesEnum): string {
    const prefix = 'Variables::'
    const key = category
    if (key.startsWith(prefix)) {
      return camelize(key.slice(prefix.length))
    }
    return key
  }
}

export const VariableService = Variable.getInstance()
