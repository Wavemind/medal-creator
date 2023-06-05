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
  ProjectId,
  AlgorithmId,
} from './common'
import type { Language } from './language'
import type { TreeNodeModel } from './tree'

export type AlgorithmInputs = {
  name: string
  mode: string
  ageLimit: number
  minimumAge: number
  algorithmLanguages: string[]
  description?: string
  ageLimitMessage?: string
}

export type AlgorithmQuery = DefaultAlgorithmProps &
  DescriptionTranslations & {
    languageIds: number[]
    projectId?: number
    ageLimitMessageTranslations: StringIndexType
    fullOrderJson?: string
  }

export type Algorithm = AlgorithmQuery & {
  id: number
  status: string
  updatedAt: Date
  createdAt: Date
  languages: Language[]
}

export type AlgorithmOrder = UsedVariables & {
  id: number
  name: string
  formattedConsultationOrder: TreeNodeModel[]
}

export type UsedVariables = {
  usedVariables: number[]
}

export type AlgorithmFormComponent = FC<ProjectId & Partial<AlgorithmId>>
