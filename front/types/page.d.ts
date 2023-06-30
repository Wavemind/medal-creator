/**
 * The external imports
 */
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import type { AppProps } from 'next/app'

/**
 * The internal imports
 */
import type {
  ProjectId,
  StringIndexType,
  AlgorithmId,
  IsAdminOrClinician,
} from './common'
import type { AllowedUser } from './user'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppWithLayoutPage = AppProps & {
  Component: NextPageWithLayout
}

export type NewProjectPage = {
  hashStoreLanguage: StringIndexType
}

export type EditProjectPage = ProjectId & {
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  previousAllowedUsers: AllowedUser[]
}

export type AlgorithmsPage = ProjectId & IsAdminOrClinician

export type LibraryPage = ProjectId & IsAdminOrClinician

export type AlgorithmPage = AlgorithmsPage & AlgorithmId & IsAdminOrClinician

export type CustomErrorPage = NextPage<ErrorProps>

export type ConsultationOrderPage = AlgorithmId & IsAdminOrClinician

export type DiagramPage = {
  diagramType: DiagramType
  initialNodes: Node<AvailableNode>[]
  initialEdges: Edge[]
}
