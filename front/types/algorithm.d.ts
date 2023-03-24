/**
 * The external imports
 */
import type { FC } from 'react'

/**
 * The internal imports
 */
import type {
  DescriptionTranslations,
  StringIndexType,
  projectId,
  algorithmId,
} from './common'
import type { Language } from './language'

export type DefaultAlgorithmProps = {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
}

export type AlgorithmInputs = DefaultAlgorithmProps & {
  algorithmLanguages: number[]
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmQuery = DefaultAlgorithmProps &
  DescriptionTranslations & {
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

export type AlgorithmFormComponent = FC<projectId & Partial<algorithmId>>
