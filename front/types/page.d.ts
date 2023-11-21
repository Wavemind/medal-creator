/**
 * The external imports
 */
import { ReactElement, ReactNode } from 'react'
import type { Node, Edge } from 'reactflow'
import type { NextPage } from 'next'
import type { ErrorProps } from 'next/error'
import type { AppProps } from 'next/app'

/**
 * The internal imports
 */
import type { AlgorithmId, Languages } from './common'
import type { AllowedUser } from './user'
import type { InstantiatedNode } from './diagram'
import { DiagramEnum } from './graphql'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppWithLayoutPage = AppProps & {
  Component: NextPageWithLayout
}

export type NewProjectPage = {
  hashStoreLanguage: Languages
}

export type EditProjectPage = {
  emergencyContentTranslations: Languages
  studyDescriptionTranslations: Languages
  previousAllowedUsers: AllowedUser[]
}

export type AlgorithmPage = AlgorithmId

export type CustomErrorPage = NextPage<ErrorProps>

export type MedalDataConfigPage = AlgorithmId
export type ConsultationOrderPage = AlgorithmId

export type DiagramPage = {
  diagramType: DiagramEnum
  instanceableId: string
  initialNodes: Node<InstantiatedNode>[]
  initialEdges: Edge[]
}

export type ExportsPage = AlgorithmId
