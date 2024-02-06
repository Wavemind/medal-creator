/**
 * The external imports
 */
import type {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  ReactElement,
} from 'react'
import type { BoxProps } from '@chakra-ui/react'
import type { Edge, Node } from 'reactflow'
import type { ClientError } from 'graphql-request'
import type { SerializedError } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { DiagramEnum, Scalars, AlgorithmStatusEnum } from './graphql'
import type { MediaType } from './node'
import type { Index, IsDisabled } from './common'
import type {
  AvailableNode,
  DiagramAnswers,
  InstantiatedNode,
  CutOffEdgeData,
  ScoreEdgeData,
} from './diagram'
import type { DiagramPage } from './page'
import type { Option } from './input'
import type { WebSocketMessage } from './context'
import { PublishAlgorithm } from '@/lib/api/modules/enhanced/algorithm.enhanced'

export type PageComponent = FC<
  PropsWithChildren<{
    title: string
  }>
>

export type UnavailableComponent = FC<IsDisabled>
export type CategoryComponent = FC<
  IsDisabled & { formEnvironment?: DiagramEnum }
>

export type ComplaintCategoryComponent = FC<
  {
    restricted: boolean
  } & IsDisabled
>
export type DefaultFormulationProps = FC<Index & IsDisabled>
export type PlaceholderComponent = FC
export type MedicationFormComponent = FC<{
  isRestricted: boolean
  append: Dispatch
  onAppend: () => void
}>

export type DiagramWrapperComponent = FC<
  Omit<DiagramPage, 'diagramType' | 'instanceableId' | 'projectId'> & {
    initialNodes: Node<InstantiatedNode>[]
    initialEdges: Edge[]
  }
>
export type AvailableNodeComponent = FC<{ node: AvailableNode }>
export type DiagramNodeComponent = FC<{
  data: AvailableNode & { minScore?: number | null }
  fromAvailableNode?: boolean
}>
export type DiagramNodeAnswersComponent = FC<{
  bg: string
  answers: DiagramAnswers[]
}>

export type NodeHeaderComponent = FC<{
  backgroundColor: string
  icon: ReactElement | undefined
  category: string
  color: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  isNeonat: boolean
  fromAvailableNode: boolean
  minScore?: number | null
}>

export type NodeHeaderMenuComponent = FC<{
  color: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}>

export type NodeWrapperComponent = FC<{
  backgroundColor: string
  headerTitle: string | undefined
  headerIcon?: ReactElement
  children: ReactElement
  color: string
  isNeonat?: boolean
  fromAvailableNode: boolean
  minScore?: number | null
}>

export type AnswerTypeComponent = FC<IsDisabled>

export type MediaComponent = FC<{
  filesToAdd: File[]
  existingFiles: MediaType[]
  setFilesToAdd: Dispatch<SetStateAction<File[]>>
  existingFilesToRemove: number[]
  setExistingFilesToRemove: Dispatch<SetStateAction<number[]>>
}>

export type ConditionFormComponent = FC<{
  conditionId: Scalars['ID']
  close: () => void
  callback: (data: CutOffEdgeData) => void
}>

export type ScoreFormComponent = FC<{
  conditionId: Scalars['ID']
  close: () => void
  callback: (data: ScoreEdgeData) => void
}>

export type ExcludedNodesComponent = FC<{
  nodeId: Scalars['ID']
  nodeType: 'drug' | 'management'
  nodeQuery: any
  lazyNodesQuery: any
}>

export type ExcludedNodeComponent = FC<
  Index & {
    exclusion: Option | null
    setNewExclusions: Dispatch<SetStateAction<(Option | null)[]>>
    nodeType: 'drug' | 'management'
    lazyNodesQuery: any
  }
>

export type DiagramButtonComponent = FC<
  PropsWithChildren & {
    href: string
    isDisabled?: boolean
  }
>

export type UserMenuComponent = FC<{ short?: boolean }>

export type CardComponent = FC<BoxProps & PropsWithChildren>
export type BadgeComponent = FC<
  PropsWithChildren<{ variableId?: string; functionName?: string }>
>

export type FormLabelComponent = FC<
  PropsWithChildren & {
    name: string
    isRequired?: boolean
  }
>

export type CutOffComponent = FC<{ columns?: number; isDisabled?: boolean }>

export type DuplicateComponent = FC<{
  error:
    | ClientError
    | {
        message: string
      }
    | SerializedError
    | undefined

  setIsDuplicating: Dispatch<SetStateAction<boolean>>
}>

export type AlgorithmStatusComponent = FC<{ status: AlgorithmStatusEnum }>

export type CurrentMessageComponent = FC<{ message: string }>

export type PastMessageComponent = FC<{ message: WebSocketMessage }>

export type ValidationErrorsComponent = FC<{
  errors: PublishAlgorithm
  selectedAlgorithmId: Scalars['ID'] | null
}>
