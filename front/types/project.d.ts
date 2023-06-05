/**
 * The external imports
 */
import type { FC, Dispatch, SetStateAction } from 'react'

/**
 * The internal imports
 */
import type { StringIndexType } from './common'
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

export type ProjectInputs = ProjectDefaultProps & {
  villages: File | null
  languageId: string
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
