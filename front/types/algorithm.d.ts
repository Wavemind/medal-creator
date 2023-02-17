/**
 * The internal imports
 */
import type { StringIndexType } from './common'
import type { Language } from './language'

export type Algorithm = Language & {
  id: number
  name: string
  minimumAge: number
  ageLimit: number
  mode: string
  descriptionTranslations: StringIndexType
  ageLimitMessageTranslations: StringIndexType
}
