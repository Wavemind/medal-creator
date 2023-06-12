/**
 * The internal imports
 */
import { LabelTranslations } from './common'

export type GetManagementsQuery = LabelTranslations & {
  id: number
  isNeonat: boolean
  hasInstances: boolean
  isDefault: boolean
}
