/**
 * The external imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'

/**
 * The internal imports
 */
import type { StringIndexType } from './common'
import type { Language } from './language'
import type { UserProject } from './userProject'
import type { AllowedUser } from './user'

export type ProjectDefaultProps = {
  name: string
  description: string
  consentManagement: boolean
  trackReferral: boolean
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
}

export type Project = ProjectDefaultProps & {
  id: number
  isCurrentUserAdmin: boolean
  language: Language
  userProjects: UserProject[]
}

export type ProjectInputs = ProjectDefaultProps & {
  villages: File | null
  languageId: number | null
  userProjectsAttributes: Partial<UserProject>[]
}

export type ProjectSummary = {
  id: number
  algorithmsCount: number
  variablesCount: number
  drugsCount: number
  managementsCount: number
  questionsSequencesCount: number
}

export type ProjectFormComponent = FC<{
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
  allowedUsers: AllowedUser[]
}>
