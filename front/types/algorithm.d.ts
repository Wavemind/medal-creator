/**
 * The internal imports
 */
import type { DescriptionTranslations, StringIndexType } from './common'
import type { Language } from './language'

export type AlgorithmInputs = {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
  algorithmLanguages: number[]
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmQuery = DescriptionTranslations & {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
  languageIds: number[]
  projectId?: number
  ageLimitMessageTranslations: StringIndexType
}

export type Algorithm = AlgorithmQuery & {
  id: number
  status: string
  updatedAt: Date
  createdAt: Date
  languages: Language[]
}
