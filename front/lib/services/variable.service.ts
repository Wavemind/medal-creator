/**
 * The internal imports
 */
import { camelize } from '@/lib/utils'
import { VariableTypesEnum } from '../config/constants'

class Variable {
  private static instance: Variable
  categories: Array<VariableTypesEnum>

  constructor() {
    this.categories = Object.values(VariableTypesEnum)
  }

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
