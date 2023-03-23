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
  name: string
  description: string
  consentManagement: boolean
  trackReferral: boolean
  villages: File | null
  languageId: number | null
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  userProjectsAttributes: Partial<UserProject>[]
}

export type ProjectSummary = {
  id: number
  algorithmsCount: number
  questionsCount: number
  drugsCount: number
  managementsCount: number
  questionsSequencesCount: number
}

export type ProjectFormProps = FC<{
  setAllowedUsers: Dispatch<SetStateAction<AllowedUser[]>>
  allowedUsers: AllowedUser[]
}>
