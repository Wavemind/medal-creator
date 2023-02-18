/**
 * The internal imports
 */
import type { StringIndexType } from './common'
import type { Language } from './language'
import type { UserProject, UserProjectInputs } from './userProject'

export type Project = {
  id: number
  name: string
  isCurrentUserAdmin: boolean
  language: Language
  description: string
  consentManagement: boolean
  trackReferral: boolean
  userProjects: UserProject[]
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
}

export type ProjectInputs = {
  id?: number
  name: string
  description: string
  consentManagement: boolean
  trackReferral: boolean
  villages: File | null
  languageId: number | null
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  userProjectsAttributes: UserProjectInputs[]
}

export type ProjectSummary = {
  id: number
  algorithmsCount: number
  questionsCount: number
  drugsCount: number
  managementsCount: number
  questionsSequencesCount: number
}
