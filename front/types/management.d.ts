/**
 * The internal imports
 */
import { LabelTranslations } from './common'

export type Management = LabelTranslations & {
  id: number
  isNeonat: boolean
  hasInstances: boolean
  isDefault: boolean
}
