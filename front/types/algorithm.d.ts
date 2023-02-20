/**
 * The internal imports
 */
import type { DescriptionTranslations, StringIndexType } from './common'
import type { Language } from './language'

export type AlgorithmInputs = {
  name: string
  minimumAge: number
  ageLimit: number
  mode: string
  algorithmLanguages?: number[]
  description?: string
  ageLimitMessage?: string
}

export type Algorithm = DescriptionTranslations & {
  id: number
  name: string
  ageLimit: number
  mode: string
  ageLimitMessageTranslations: StringIndexType[]
  status: string
  updatedAt: Date
  createdAt: Date
  languages: Language[]
}
