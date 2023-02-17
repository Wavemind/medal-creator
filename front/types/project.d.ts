/**
 * The internal imports
 */
import type { StringIndexType } from "./common"
import type { Language } from "./language"
import type { UserProject } from "./userProject"

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

export type ProjectSummary = {
  id: number
  algorithmsCount: number
  questionsCount: number
  drugsCount: number
  managementsCount: number
  questionsSequencesCount: number
}
