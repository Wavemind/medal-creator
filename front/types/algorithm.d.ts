/**
 * The internal imports
 */
import type { DescriptionTranslations, StringIndexType } from './common'
import type { Language } from './language'

export type Algorithm = Language &
  DescriptionTranslations & {
    id: number
    name: string
    minimumAge: number
    ageLimit: number
    mode: string
    ageLimitMessageTranslations: StringIndexType
  }
